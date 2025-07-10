import { NextResponse } from 'next/server';
import { companyService } from '../../../../../../lib/database';

export async function GET() {
  try {
    const companies = await companyService.getAll();
    return NextResponse.json({ count: companies.length });
  } catch (error) {
    console.error('Error counting clients:', error);
    return NextResponse.json(
      { error: 'Failed to count clients' },
      { status: 500 }
    );
  }
}
