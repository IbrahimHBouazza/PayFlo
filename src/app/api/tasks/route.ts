import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '../../../../lib/database';
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
    const status = searchParams.get('status');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    let tasks;
    if (status) {
      tasks = await taskService.getByStatus(companyId, status as any);
    } else {
      tasks = await taskService.getByCompany(companyId);
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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
    if (!body.title || !body.company_id || !body.due_date) {
      return NextResponse.json(
        { error: 'Title, company ID, and due date are required' },
        { status: 400 }
      );
    }

    const task = await taskService.create({
      title: body.title,
      description: body.description,
      company_id: body.company_id,
      status: body.status || 'TODO',
      due_date: body.due_date,
      assigned_to: body.assigned_to
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
