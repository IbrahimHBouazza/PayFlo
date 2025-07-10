import { NextRequest, NextResponse } from 'next/server';
import { financialService } from '../../../../lib/database';
// import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // TEMP: Bypass Clerk for testing
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const summary = searchParams.get('summary');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    if (summary === 'true') {
      const financialSummary = await financialService.getSummary(companyId);
      return NextResponse.json(financialSummary);
    }

    const records = await financialService.getByCompany(companyId);
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching financial records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TEMP: Bypass Clerk for testing
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();

    // Validate required fields
    if (!body.company_id || !body.period) {
      return NextResponse.json(
        { error: 'Company ID and period are required' },
        { status: 400 }
      );
    }

    const record = await financialService.create({
      company_id: body.company_id,
      period: body.period,
      revenue: body.revenue || 0,
      expenses: body.expenses || 0,
      profit: body.profit || 0,
      tax_liability: body.tax_liability || 0
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating financial record:', error);
    return NextResponse.json(
      { error: 'Failed to create financial record' },
      { status: 500 }
    );
  }
}
