import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getOrCreateCompany } from '@/lib/company';
import { serializeData } from '@/lib/serialization';
import { LevelStandardized, Currency, TransportSource } from '@prisma/client';

// Define the validation schemas
const locationSchema = z.string()
  .trim()
  .min(1, 'Location is required')
  .refine(
    (val) => {
      const lower = val.toLowerCase();
      const hasComma = val.includes(',');
      const hasCountry = ['india', 'usa', 'uk', 'united states', 'united kingdom', 'us'].some(
        (suffix) => lower.endsWith(` ${suffix}`) || lower.endsWith(`, ${suffix}`) || lower === suffix
      );
      return !hasComma && !hasCountry;
    },
    { message: 'Location must be city name only. No country suffixes or commas allowed.' }
  );

const baseSalarySchema = z.union([z.number(), z.string(), z.bigint()])
  .refine(val => {
    try {
      const b = BigInt(val);
      return b > 0n;
    } catch {
      return false;
    }
  }, { message: 'Base salary must be a positive integer' })
  .transform(val => BigInt(val));

const bonusSchema = z.union([z.number(), z.string(), z.bigint()])
  .optional()
  .refine(val => {
    if (val === undefined) return true;
    try {
      const b = BigInt(val);
      return b >= 0n;
    } catch {
      return false;
    }
  }, { message: 'Bonus must be a non-negative integer' })
  .transform(val => val !== undefined ? BigInt(val) : 0n);

const stockSchema = z.union([z.number(), z.string(), z.bigint()])
  .optional()
  .refine(val => {
    if (val === undefined) return true;
    try {
      const b = BigInt(val);
      return b >= 0n;
    } catch {
      return false;
    }
  }, { message: 'Stock must be a non-negative integer' })
  .transform(val => val !== undefined ? BigInt(val) : 0n);

const ingestSchema = z.object({
  company_name: z.string().trim().min(1, 'Company name is required'),
  industry: z.string().trim().min(1, 'Industry is required'),
  headquarters: z.string().trim().min(1, 'Headquarters is required'),
  founded_year: z.number().int().nullable().optional(),
  headcount_range: z.string().trim().nullable().optional(),
  role: z.string().trim().min(1, 'Role is required'),
  level: z.nativeEnum(LevelStandardized, {
    errorMap: () => ({ message: 'Invalid level. Allowed levels: L3, L4, L5, L6, SDE_I, SDE_II, SDE_III, STAFF, PRINCIPAL, IC4, IC5' })
  }),
  location: locationSchema,
  currency: z.nativeEnum(Currency, {
    errorMap: () => ({ message: 'Invalid currency. Allowed currencies: INR, USD, GBP, EUR' })
  }),
  experience_years: z.number()
    .int('Experience years must be an integer')
    .min(1, 'Experience years must be between 1 and 50')
    .max(50, 'Experience years must be between 1 and 50'),
  base_salary: baseSalarySchema,
  bonus: bonusSchema,
  stock: stockSchema,
  source: z.nativeEnum(TransportSource, {
    errorMap: () => ({ message: 'Invalid transport source. Allowed sources: CONTRIBUTOR, SCRAPED, AI_INFERRED' })
  }),
  confidence_score: z.number()
    .min(0.0, 'Confidence score must be between 0.00 and 1.00')
    .max(1.0, 'Confidence score must be between 0.00 and 1.00'),
  is_verified: z.boolean().optional().default(false)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Remove total_compensation if sent in payload
    if ('total_compensation' in body) {
      delete body.total_compensation;
    }

    // Run validation chain
    const validation = ingestSchema.safeParse(body);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const field = firstIssue.path.join('.');
      return NextResponse.json({
        error: true,
        field,
        message: firstIssue.message
      }, { status: 400 });
    }

    const input = validation.data;

    // Run database operations inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get or create company record
      const company = await getOrCreateCompany(tx, {
        name: input.company_name,
        industry: input.industry,
        headquarters: input.headquarters,
        founded_year: input.founded_year,
        headcount_range: input.headcount_range,
      });

      // 2. 48-Hour Proximity Deduplication Engine
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const duplicates = await tx.salary.findMany({
        where: {
          company_id: company.id,
          role: input.role,
          level: input.level,
          location: input.location,
          submitted_at: {
            gte: fortyEightHoursAgo,
          },
        },
      });

      const isDuplicate = duplicates.some((existing) => {
        const incomingBase = input.base_salary;
        const existingBase = existing.base_salary;
        // Check if existing base_salary falls within ±10% range of incoming base_salary:
        // incoming * 0.9 <= existing <= incoming * 1.1
        return existingBase * 10n >= incomingBase * 9n && existingBase * 10n <= incomingBase * 11n;
      });

      if (isDuplicate) {
        throw new Error('DUPLICATE_SUBMISSION');
      }

      // 3. Compute total compensation
      const total_compensation = input.base_salary + input.bonus + input.stock;

      // 4. Create and save the salary record
      const salary = await tx.salary.create({
        data: {
          company_id: company.id,
          role: input.role,
          level: input.level,
          location: input.location,
          currency: input.currency,
          experience_years: input.experience_years,
          base_salary: input.base_salary,
          bonus: input.bonus,
          stock: input.stock,
          total_compensation,
          source: input.source,
          confidence_score: input.confidence_score,
          is_verified: input.is_verified,
        },
        include: {
          company: true,
        },
      });

      return salary;
    });

    return NextResponse.json(serializeData(result), { status: 201 });
  } catch (error: any) {
    if (error.message === 'DUPLICATE_SUBMISSION') {
      return NextResponse.json({
        error: true,
        message: 'Conflict: A similar salary record has already been submitted for this company, role, level, and location within the last 48 hours.'
      }, { status: 409 });
    }

    return NextResponse.json({
      error: true,
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
