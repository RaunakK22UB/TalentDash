import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeData } from '@/lib/serialization';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // In Next.js 15, params is a promise and must be awaited
    const { slug: rawSlug } = await params;
    const slug = rawSlug?.toLowerCase();

    if (!slug) {
      return NextResponse.json({
        error: true,
        message: 'Company slug is required'
      }, { status: 400 });
    }

    // Lookup company by unique slug
    const company = await prisma.company.findUnique({
      where: { slug },
    });

    if (!company) {
      return NextResponse.json({
        error: true,
        message: 'Company not found'
      }, { status: 404 });
    }

    // Fetch all salaries linked to the company, sorted by total_compensation descending
    const salaries = await prisma.salary.findMany({
      where: {
        company_id: company.id,
      },
      orderBy: {
        total_compensation: 'desc',
      },
    });

    // Compute true statistical median of total_compensation
    let median_compensation = 0n;
    if (salaries.length > 0) {
      // Create a sorted list of total compensation numbers
      const tcValues = salaries.map(s => s.total_compensation); // Keep as BigInt
      tcValues.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

      const len = tcValues.length;
      const mid = Math.floor(len / 2);
      
      if (len % 2 !== 0) {
        // Odd length: exact middle element
        median_compensation = tcValues[mid];
      } else {
        // Even length: average of the two middle elements
        median_compensation = (tcValues[mid - 1] + tcValues[mid]) / 2n;
      }
    }

    // Compute dynamic level distribution map
    const level_distribution: Record<string, number> = {};
    for (const salary of salaries) {
      const lvl = salary.level;
      level_distribution[lvl] = (level_distribution[lvl] || 0) + 1;
    }

    // Structure response payload
    const responsePayload = {
      company,
      stats: {
        median_compensation,
        level_distribution,
      },
      // Support strict prompt specifications at the root
      ...company,
      median_total_compensation: median_compensation,
      level_distribution,
      salaries,
    };

    return NextResponse.json(serializeData(responsePayload));
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
