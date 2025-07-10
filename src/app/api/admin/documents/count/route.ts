import { NextResponse } from 'next/server';
import { documentService } from '../../../../../../lib/database';
import { supabaseAdmin } from '../../../../../../lib/supabase';

export async function GET() {
  try {
    // First check if admin client is configured
    if (!supabaseAdmin) {
      console.error('Supabase admin client not configured');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Test direct query first
    const { data: testData, error: testError } = await supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: true });

    if (testError) {
      console.error('Direct Supabase query error:', testError);
      return NextResponse.json(
        { error: `Database error: ${testError.message}` },
        { status: 500 }
      );
    }

    // If direct query works, try the service
    const documents = await documentService.getAll();
    return NextResponse.json({ count: documents.length });
  } catch (error) {
    console.error('Error counting documents:', error);
    return NextResponse.json(
      {
        error: 'Failed to count documents',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
