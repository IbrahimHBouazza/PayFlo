import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '../../../../../lib/database';

// GET /api/admin/clients - List all clients
export async function GET() {
  try {
    const companies = await companyService.getAll();

    // Transform companies to match the expected client format
    const clients = companies.map((company) => ({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      taxId: company.tax_id,
      status: company.status,
      lastInvoice: null, // Not available in current schema
      totalRevenue: 0, // Would need to calculate from financial records
      pendingTasks: 0 // Would need to calculate from tasks
    }));

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST /api/admin/clients - Create a new client
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, address, taxId } = data;

    // Create company using the database service
    const company = await companyService.create({
      name,
      email,
      phone,
      address,
      tax_id: taxId,
      status: 'ACTIVE'
    });

    // Transform to match expected client format
    const client = {
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      taxId: company.tax_id,
      status: company.status,
      lastInvoice: null,
      totalRevenue: 0,
      pendingTasks: 0
    };

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
