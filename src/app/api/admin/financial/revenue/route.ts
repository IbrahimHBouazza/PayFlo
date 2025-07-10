import { NextResponse } from 'next/server';
import { financialService } from '../../../../../../lib/database';

export async function GET() {
  try {
    // Get all financial records from all companies
    const allRecords = await financialService.getAll();
    const total = allRecords.reduce(
      (sum, record) => sum + (record.revenue || 0),
      0
    );
    return NextResponse.json({ total });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return NextResponse.json(
      { error: 'Failed to calculate total revenue' },
      { status: 500 }
    );
  }
}
