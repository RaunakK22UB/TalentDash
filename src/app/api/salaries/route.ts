import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeData } from '@/lib/serialization';
import { Prisma, LevelStandardized, Currency } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Parse filters
    const companyQuery = searchParams.get('company')?.trim();
    const roleQuery = searchParams.get('role')?.trim();
    const locationQuery = searchParams.get('location')?.trim();
    const levelQuery = searchParams.get('level')?.trim();
    const currencyQuery = searchParams.get('currency')?.trim();
    const sortQuery = searchParams.get('sort')?.trim();

    // Parse pagination parameters
    let page = parseInt(searchParams.get('page') || '1', 10);
    let limit = parseInt(searchParams.get('limit') || '25', 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 25;

    // Enforce intercept ceiling block
    if (limit > 100) {
      limit = 100;
    }

    // Build Prisma query filters
    const where: Prisma.SalaryWhereInput = {};

    if (companyQuery) {
      where.company = {
        OR: [
          { name: { contains: companyQuery, mode: 'insensitive' } },
          { slug: { contains: companyQuery, mode: 'insensitive' } }
        ]
      };
    }

    if (roleQuery) {
      where.role = {
        contains: roleQuery,
        mode: 'insensitive'
      };
    }

    if (locationQuery) {
      where.location = {
        contains: locationQuery,
        mode: 'insensitive'
      };
    }

    if (levelQuery) {
      // Validate enum level
      if (Object.values(LevelStandardized).includes(levelQuery as LevelStandardized)) {
        where.level = levelQuery as LevelStandardized;
      }
    }

    if (currencyQuery) {
      // Validate enum currency
      if (Object.values(Currency).includes(currencyQuery as Currency)) {
        where.currency = currencyQuery as Currency;
      }
    }

    // Determine sorting strategy
    let orderBy: Prisma.SalaryOrderByWithRelationInput = { total_compensation: 'desc' }; // Default
    if (sortQuery === 'total_comp_asc') {
      orderBy = { total_compensation: 'asc' };
    } else if (sortQuery === 'date_desc') {
      orderBy = { submitted_at: 'desc' };
    }

    // Calculate skip offset
    const skip = (page - 1) * limit;

    // Execute queries in parallel for performance
    const [total, salaries] = await Promise.all([
      prisma.salary.count({ where }),
      prisma.salary.findMany({
        where,
        include: {
          company: true,
        },
        orderBy,
        skip,
        take: limit,
      })
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit) || 1;

    // Return structured, serialized JSON response
    return NextResponse.json({
      data: serializeData(salaries),
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
