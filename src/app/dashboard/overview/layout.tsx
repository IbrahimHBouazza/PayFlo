'use client';

import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import {
  IconTrendingDown,
  IconTrendingUp,
  IconFileInvoice,
  IconClock,
  IconCheck,
  IconAlertTriangle
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useDashboardOverview } from '@/hooks/use-api';
import { useUser } from '@clerk/nextjs';

// For now, we'll use a hardcoded company ID - in a real app, this would come from user context
const DEMO_COMPANY_ID = '5ec7a493-de97-403e-8efe-67bef2615fe9'; // Acme Corporation

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const { user } = useUser();
  const {
    data: overview,
    loading,
    error,
    refetch
  } = useDashboardOverview(DEMO_COMPANY_ID);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get next deadline
  const getNextDeadline = () => {
    if (!overview?.recent?.deadlines?.length) return null;
    return overview.recent.deadlines[0];
  };

  const nextDeadline = getNextDeadline();

  if (loading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-2'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>Loading...</h2>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className='animate-pulse'>
                <CardHeader>
                  <div className='h-4 w-3/4 rounded bg-gray-200'></div>
                  <div className='h-8 w-1/2 rounded bg-gray-200'></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-2'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Error Loading Dashboard
            </h2>
          </div>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <IconAlertTriangle className='mx-auto mb-4 h-12 w-12 text-red-500' />
              <p className='mb-2 text-red-600'>Failed to load dashboard data</p>
              <p className='text-muted-foreground mb-4 text-sm'>{error}</p>
              <button
                onClick={() => refetch()}
                className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2'
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  const companyName = overview?.company?.name || 'Your Company';
  const stats = overview?.stats;
  const taskStats = stats?.tasks || {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  };
  const financialStats = stats?.financial || {
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalTaxLiability: 0
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Welcome back, {companyName}
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {formatCurrency(financialStats.totalRevenue)}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp className='h-3 w-3' />
                  {financialStats.totalRevenue > 0 ? 'Positive' : 'No Data'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Net Profit: {formatCurrency(financialStats.totalProfit)}{' '}
                <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Based on all financial records
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Pending Tasks</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {taskStats.todo + taskStats.inProgress}
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-orange-500'>
                  <IconClock className='h-3 w-3' />
                  Awaiting
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {taskStats.overdue > 0
                  ? `${taskStats.overdue} overdue`
                  : 'All on track'}
                {taskStats.overdue > 0 ? (
                  <IconTrendingDown className='size-4' />
                ) : (
                  <IconTrendingUp className='size-4' />
                )}
              </div>
              <div className='text-muted-foreground'>
                {taskStats.inProgress > 0
                  ? `${taskStats.inProgress} in progress`
                  : 'No active tasks'}
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Completed Tasks</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {taskStats.completed}
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-green-500'>
                  <IconCheck className='h-3 w-3' />
                  Done
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {taskStats.completed > 0
                  ? 'Excellent progress'
                  : 'No completed tasks'}{' '}
                <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                {taskStats.total > 0
                  ? `${Math.round((taskStats.completed / taskStats.total) * 100)}% completion rate`
                  : 'No tasks yet'}
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Next Deadline</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {nextDeadline
                  ? new Date(nextDeadline.due_date).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric' }
                    )
                  : 'None'}
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-blue-500'>
                  {nextDeadline ? nextDeadline.title : 'No deadlines'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {nextDeadline ? (
                  <>
                    {Math.ceil(
                      (new Date(nextDeadline.due_date).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days remaining
                    <IconTrendingUp className='size-4' />
                  </>
                ) : (
                  <>
                    All caught up <IconCheck className='size-4' />
                  </>
                )}
              </div>
              <div className='text-muted-foreground'>
                {nextDeadline
                  ? nextDeadline.description || 'Task due soon'
                  : 'No upcoming deadlines'}
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* Recent Activity */}
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
