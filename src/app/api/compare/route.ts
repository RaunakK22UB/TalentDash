import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeData } from '@/lib/serialization';

// Helper to validate UUID format
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const s1 = searchParams.get('s1')?.trim();
    const s2 = searchParams.get('s2')?.trim();

    // 1. Input Verification
    if (!s1 || !s2) {
      return NextResponse.json({
        error: true,
        message: 'Both s1 and s2 query parameters are required'
      }, { status: 400 });
    }

    if (!UUID_REGEX.test(s1) || !UUID_REGEX.test(s2)) {
      return NextResponse.json({
        error: true,
        message: 'Invalid UUID format for s1 or s2'
      }, { status: 400 });
    }

    // Overlapping defense: check if identifiers are identical
    if (s1 === s2) {
      return NextResponse.json({
        error: true,
        message: 's1 and s2 query parameters must be distinct'
      }, { status: 400 });
    }

    // Fetch both records in parallel
    const [salary1, salary2] = await Promise.all([
      prisma.salary.findUnique({
        where: { id: s1 },
        include: { company: true },
      }),
      prisma.salary.findUnique({
        where: { id: s2 },
        include: { company: true },
      }),
    ]);

    // Corruption defense: check if both records exist
    if (!salary1 || !salary2) {
      return NextResponse.json({
        error: true,
        message: 'One or both of the specified salary records could not be found'
      }, { status: 404 });
    }

    // 2. Symmetric Delta Computation (Record 1 - Record 2)
    const base_delta = salary1.base_salary - salary2.base_salary;
    const bonus_delta = salary1.bonus - salary2.bonus;
    const stock_delta = salary1.stock - salary2.stock;
    const tc_delta = salary1.total_compensation - salary2.total_compensation;
    const experience_delta = salary1.experience_years - salary2.experience_years;

    const responsePayload = {
      salary1,
      salary2,
      record1: salary1,
      record2: salary2,
      s1: salary1,
      s2: salary2,
      delta: {
        base_delta,
        bonus_delta,
        stock_delta,
        tc_delta,
        experience_delta,
      },
    };

    return NextResponse.json(serializeData(responsePayload));
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
