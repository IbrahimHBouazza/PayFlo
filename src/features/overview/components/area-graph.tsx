'use client';

import * as React from 'react';
import { IconTrendingUp, IconAlertTriangle } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useFinancialRecords } from '@/hooks/use-api';

// For now, we'll use a hardcoded company ID - in a real app, this would come from user context
const DEMO_COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#0f172a'
  },
  expenses: {
    label: 'Expenses',
    color: '#64748b'
  },
  profit: {
    label: 'Net Profit',
    color: '#16a34a'
  }
} satisfies ChartConfig;

interface FinancialRecord {
  period: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export function AreaGraph() {
  const {
    data: financialRecords,
    loading,
    error
  } = useFinancialRecords(DEMO_COMPANY_ID);

  // Transform financial records into chart data
  const chartData = React.useMemo(() => {
    if (!financialRecords) return [];

    return financialRecords
      .sort((a: FinancialRecord, b: FinancialRecord) =>
        a.period.localeCompare(b.period)
      )
      .slice(-6) // Last 6 periods
      .map((record: FinancialRecord) => ({
        period: record.period,
        revenue: record.revenue || 0,
        expenses: record.expenses || 0,
        profit: record.profit || 0
      }));
  }, [financialRecords]);

  // Calculate growth percentage
  const growthPercentage = React.useMemo(() => {
    if (chartData.length < 2) return 0;
    const firstPeriod = chartData[0];
    const lastPeriod = chartData[chartData.length - 1];
    const firstRevenue = firstPeriod.revenue;
    const lastRevenue = lastPeriod.revenue;

    if (firstRevenue === 0) return 0;
    return ((lastRevenue - firstRevenue) / firstRevenue) * 100;
  }, [chartData]);

  if (loading) {
    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardTitle>Cash Flow Overview</CardTitle>
          <CardDescription>Loading financial data...</CardDescription>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <div className='flex aspect-auto h-[250px] w-full items-center justify-center'>
            <div className='text-muted-foreground'>Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardTitle>Cash Flow Overview</CardTitle>
          <CardDescription>Failed to load financial data</CardDescription>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <div className='flex aspect-auto h-[250px] w-full items-center justify-center'>
            <div className='text-center'>
              <IconAlertTriangle className='mx-auto mb-2 h-8 w-8 text-red-500' />
              <div className='mb-2 text-red-500'>
                Error loading financial data
              </div>
              <div className='text-muted-foreground text-sm'>{error}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardTitle>Cash Flow Overview</CardTitle>
          <CardDescription>No financial data available</CardDescription>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <div className='flex aspect-auto h-[250px] w-full items-center justify-center'>
            <div className='text-center'>
              <div className='text-muted-foreground mb-2'>
                No financial records found
              </div>
              <div className='text-muted-foreground text-sm'>
                Add financial data to see cash flow trends
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Cash Flow Overview</CardTitle>
        <CardDescription>
          Revenue, expenses, and profit trends for the last {chartData.length}{' '}
          periods
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#0f172a' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#0f172a' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='fillExpenses' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#64748b' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#64748b' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='fillProfit' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#16a34a' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#16a34a' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='period'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className='grid gap-2'>
                        <div className='flex items-center justify-between gap-2'>
                          <div className='flex items-center gap-1'>
                            <div className='bg-primary h-2 w-2 rounded-full' />
                            <span className='text-muted-foreground text-sm'>
                              {payload[0].payload.period}
                            </span>
                          </div>
                        </div>
                        {payload.map((item: any) => (
                          <div
                            key={item.dataKey}
                            className='flex items-center justify-between gap-2'
                          >
                            <div className='flex items-center gap-1'>
                              <div
                                className='h-2 w-2 rounded-full'
                                style={{ backgroundColor: item.color }}
                              />
                              <span className='text-muted-foreground text-sm'>
                                {
                                  chartConfig[
                                    item.dataKey as keyof typeof chartConfig
                                  ]?.label
                                }
                              </span>
                            </div>
                            <span className='font-medium'>
                              ${item.value?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey='expenses'
              type='natural'
              fill='url(#fillExpenses)'
              stroke='#64748b'
              stackId='a'
            />
            <Area
              dataKey='revenue'
              type='natural'
              fill='url(#fillRevenue)'
              stroke='#0f172a'
              stackId='a'
            />
            <Area
              dataKey='profit'
              type='natural'
              fill='url(#fillProfit)'
              stroke='#16a34a'
              stackId='b'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {growthPercentage > 0 ? (
                <>
                  Revenue up {growthPercentage.toFixed(1)}% this period{' '}
                  <IconTrendingUp className='h-4 w-4' />
                </>
              ) : growthPercentage < 0 ? (
                <>
                  Revenue down {Math.abs(growthPercentage).toFixed(1)}% this
                  period <IconTrendingUp className='h-4 w-4 rotate-180' />
                </>
              ) : (
                <>
                  Revenue stable this period{' '}
                  <IconTrendingUp className='h-4 w-4' />
                </>
              )}
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              {chartData.length > 0 && (
                <>
                  {chartData[0].period} -{' '}
                  {chartData[chartData.length - 1].period}
                </>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
