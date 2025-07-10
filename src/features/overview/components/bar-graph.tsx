'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
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

export const description = 'Financial performance over time';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--primary)'
  },
  profit: {
    label: 'Net Profit',
    color: 'hsl(var(--chart-2))'
  },
  tax_liability: {
    label: 'Tax Liability',
    color: 'hsl(var(--chart-3))'
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-4))'
  }
} satisfies ChartConfig;

interface FinancialRecord {
  period: string;
  revenue: number;
  profit: number;
  tax_liability: number;
  expenses: number;
}

export function BarGraph() {
  const {
    data: financialRecords,
    loading,
    error
  } = useFinancialRecords(DEMO_COMPANY_ID);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('revenue');

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
        profit: record.profit || 0,
        tax_liability: record.tax_liability || 0,
        expenses: record.expenses || 0
      }));
  }, [financialRecords]);

  const totals = React.useMemo(
    () => ({
      revenue: chartData.reduce(
        (acc: number, curr: any) => acc + curr.revenue,
        0
      ),
      profit: chartData.reduce(
        (acc: number, curr: any) => acc + curr.profit,
        0
      ),
      tax_liability: chartData.reduce(
        (acc: number, curr: any) => acc + curr.tax_liability,
        0
      ),
      expenses: chartData.reduce(
        (acc: number, curr: any) => acc + curr.expenses,
        0
      )
    }),
    [chartData]
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <Card className='@container/card !pt-3'>
        <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
          <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>Loading financial data...</CardDescription>
          </div>
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
      <Card className='@container/card !pt-3'>
        <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
          <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>Failed to load financial data</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <div className='flex aspect-auto h-[250px] w-full items-center justify-center'>
            <div className='text-center'>
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
      <Card className='@container/card !pt-3'>
        <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
          <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>No financial data available</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <div className='flex aspect-auto h-[250px] w-full items-center justify-center'>
            <div className='text-center'>
              <div className='text-muted-foreground mb-2'>
                No financial records found
              </div>
              <div className='text-muted-foreground text-sm'>
                Add financial data to see performance charts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Financial Performance</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Last {chartData.length} periods financial overview
            </span>
            <span className='@[540px]/card:hidden'>
              {chartData.length} periods overview
            </span>
          </CardDescription>
        </div>
        <div className='flex'>
          {['revenue', 'profit', 'tax_liability', 'expenses'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || totals[key as keyof typeof totals] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  ${(totals[key as keyof typeof totals] / 1000).toFixed(0)}k
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='period'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
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
            <Bar
              dataKey={activeChart}
              fill={chartConfig[activeChart].color}
              radius={[4, 4, 0, 0]}
              className='fill-primary'
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
