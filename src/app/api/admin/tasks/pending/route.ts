import { NextResponse } from 'next/server';
import { taskService } from '../../../../../../lib/database';

export async function GET() {
  try {
    // Get all tasks from all companies that are not completed
    const allTasks = await taskService.getAll();
    const pendingTasks = allTasks.filter((task) => task.status !== 'COMPLETED');
    return NextResponse.json({ count: pendingTasks.length });
  } catch (error) {
    console.error('Error counting pending tasks:', error);
    return NextResponse.json(
      { error: 'Failed to count pending tasks' },
      { status: 500 }
    );
  }
}
