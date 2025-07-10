import { NextRequest, NextResponse } from 'next/server';
import {
  companyService,
  taskService,
  financialService,
  messageService
} from '../../../../../lib/database';
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

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get all data for the company
    const [company, tasks, financialRecords, unreadMessages] =
      await Promise.all([
        companyService.getById(companyId),
        taskService.getByCompany(companyId),
        financialService.getByCompany(companyId),
        messageService.getUnreadCount(companyId)
      ]);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Calculate task statistics
    const taskStats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'TODO').length,
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      waitingOnClient: tasks.filter((t) => t.status === 'WAITING_ON_CLIENT')
        .length,
      completed: tasks.filter((t) => t.status === 'COMPLETED').length,
      overdue: tasks.filter(
        (t) => new Date(t.due_date) < new Date() && t.status !== 'COMPLETED'
      ).length
    };

    // Calculate financial summary
    const financialSummary = financialRecords.reduce(
      (acc, record) => ({
        totalRevenue: acc.totalRevenue + (record.revenue || 0),
        totalExpenses: acc.totalExpenses + (record.expenses || 0),
        totalProfit: acc.totalProfit + (record.profit || 0),
        totalTaxLiability: acc.totalTaxLiability + (record.tax_liability || 0)
      }),
      {
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        totalTaxLiability: 0
      }
    );

    // Get recent tasks (last 5)
    const recentTasks = tasks
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);

    // Get upcoming deadlines (next 7 days)
    const upcomingDeadlines = tasks
      .filter((t) => {
        const dueDate = new Date(t.due_date);
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return (
          dueDate >= today && dueDate <= nextWeek && t.status !== 'COMPLETED'
        );
      })
      .sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      )
      .slice(0, 5);

    // Get latest financial records (last 4 quarters)
    const latestFinancials = financialRecords
      .sort((a, b) => b.period.localeCompare(a.period))
      .slice(0, 4);

    const overview = {
      company,
      stats: {
        tasks: taskStats,
        financial: financialSummary,
        unreadMessages
      },
      recent: {
        tasks: recentTasks,
        deadlines: upcomingDeadlines,
        financials: latestFinancials
      }
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard overview' },
      { status: 500 }
    );
  }
}
