'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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

const chartData = [
  { category: 'operating', amount: 45000, fill: '#0f172a' },
  { category: 'payroll', amount: 32000, fill: '#64748b' },
  { category: 'marketing', amount: 18000, fill: '#16a34a' },
  { category: 'utilities', amount: 12000, fill: '#dc2626' },
  { category: 'other', amount: 8000, fill: '#7c3aed' }
];

const chartConfig = {
  amount: {
    label: 'Amount'
  },
  operating: {
    label: 'Operating Expenses',
    color: '#0f172a'
  },
  payroll: {
    label: 'Payroll & Benefits',
    color: '#64748b'
  },
  marketing: {
    label: 'Marketing & Sales',
    color: '#16a34a'
  },
  utilities: {
    label: 'Utilities & Rent',
    color: '#dc2626'
  },
  other: {
    label: 'Other Expenses',
    color: '#7c3aed'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalExpenses = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Total expenses by category for Q4 2024
          </span>
          <span className='@[540px]/card:hidden'>Expense categories</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {[
                { category: 'operating', color: '#0f172a' },
                { category: 'payroll', color: '#64748b' },
                { category: 'marketing', color: '#16a34a' },
                { category: 'utilities', color: '#dc2626' },
                { category: 'other', color: '#7c3aed' }
              ].map((item) => (
                <linearGradient
                  key={item.category}
                  id={`fill${item.category}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='0%' stopColor={item.color} stopOpacity={0.8} />
                  <stop
                    offset='100%'
                    stopColor={item.color}
                    stopOpacity={0.4}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = (
                    (data.amount / totalExpenses) *
                    100
                  ).toFixed(1);
                  return (
                    <ChartTooltipContent>
                      <div className='grid gap-2'>
                        <div className='flex items-center justify-between gap-2'>
                          <div className='flex items-center gap-1'>
                            <div
                              className='h-2 w-2 rounded-full'
                              style={{ backgroundColor: data.fill }}
                            />
                            <span className='text-muted-foreground text-sm'>
                              {
                                chartConfig[
                                  data.category as keyof typeof chartConfig
                                ]?.label
                              }
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='text-muted-foreground text-sm'>
                            Amount:
                          </span>
                          <span className='font-medium'>
                            ${data.amount?.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='text-muted-foreground text-sm'>
                            Percentage:
                          </span>
                          <span className='font-medium'>{percentage}%</span>
                        </div>
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.category})`
              }))}
              dataKey='amount'
              nameKey='category'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          ${(totalExpenses / 1000).toFixed(0)}k
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Expenses
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Operating expenses lead with{' '}
          {((chartData[0].amount / totalExpenses) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Based on Q4 2024 financial data
        </div>
      </CardFooter>
    </Card>
  );
}
