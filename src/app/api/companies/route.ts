import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '../../../../lib/database';
// import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const companies = await companyService.getAll();
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // const { userId } = await auth();

    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if company with this email already exists
    const existingCompany = await companyService.getByEmail(body.email);
    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company with this email already exists' },
        { status: 409 }
      );
    }

    // Prepare company data with proper defaults, excluding logo_url which is not in the database schema
    const { logo_url, ...companyData } = body;

    const cleanCompanyData = {
      name: companyData.name,
      email: companyData.email,
      phone: companyData.phone || undefined,
      address: companyData.address || undefined,
      tax_id: companyData.tax_id || undefined,
      contact_person: companyData.contact_person || undefined,
      industry: companyData.industry || undefined,
      year_established: companyData.year_established
        ? parseInt(companyData.year_established.toString())
        : undefined,
      status: companyData.status || 'ACTIVE'
    };

    // Remove any undefined values to prevent database errors
    Object.keys(cleanCompanyData).forEach((key) => {
      if (
        cleanCompanyData[key as keyof typeof cleanCompanyData] === undefined
      ) {
        delete cleanCompanyData[key as keyof typeof cleanCompanyData];
      }
    });

    console.log('Creating company with data:', cleanCompanyData);

    const company = await companyService.create(cleanCompanyData);

    console.log('Company created successfully:', company);

    return NextResponse.json(company, { status: 201 });
  } catch (error: any) {
    console.error('Error creating company:', error);

    // Provide more specific error messages
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        {
          error:
            'Database error: Insert operation did not return expected data. This may be due to RLS policies or database configuration.',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create company',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
