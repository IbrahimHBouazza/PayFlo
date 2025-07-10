'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconBuilding,
  IconFileInvoice,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconCurrencyDollar,
  IconClock
} from '@tabler/icons-react';

type Company = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalRevenue: number;
  pendingInvoices: number;
  completedTasks: number;
  pendingTasks: number;
  lastInvoiceDate: string;
  nextDueDate: string;
};

// Sample company data
const sampleCompanies: Record<string, Company> = {
  '1': {
    id: '1',
    name: 'Acme Corporation',
    email: 'finance@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    taxId: '12-3456789',
    status: 'ACTIVE',
    totalRevenue: 125000,
    pendingInvoices: 2,
    completedTasks: 15,
    pendingTasks: 3,
    lastInvoiceDate: '2024-01-15',
    nextDueDate: '2024-02-15'
  },
  '2': {
    id: '2',
    name: 'TechStart Solutions',
    email: 'accounting@techstart.com',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Dr, San Francisco, CA 94102',
    taxId: '98-7654321',
    status: 'ACTIVE',
    totalRevenue: 89000,
    pendingInvoices: 1,
    completedTasks: 12,
    pendingTasks: 2,
    lastInvoiceDate: '2024-01-10',
    nextDueDate: '2024-02-10'
  },
  '3': {
    id: '3',
    name: 'Green Earth Industries',
    email: 'finance@greenearth.com',
    phone: '+1 (555) 456-7890',
    address: '789 Eco Way, Portland, OR 97201',
    taxId: '45-6789012',
    status: 'ACTIVE',
    totalRevenue: 210000,
    pendingInvoices: 3,
    completedTasks: 8,
    pendingTasks: 5,
    lastInvoiceDate: '2024-01-20',
    nextDueDate: '2024-02-20'
  },
  '4': {
    id: '4',
    name: 'Global Trading Co',
    email: 'accounts@globaltrading.com',
    phone: '+1 (555) 321-0987',
    address: '321 Commerce St, Chicago, IL 60601',
    taxId: '32-1098765',
    status: 'INACTIVE',
    totalRevenue: 75000,
    pendingInvoices: 0,
    completedTasks: 20,
    pendingTasks: 0,
    lastInvoiceDate: '2023-12-15',
    nextDueDate: 'N/A'
  }
};

export default function CompanyOverviewPage({
  params
}: {
  params: { companyId: string };
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user is admin
      if (user.publicMetadata?.role !== 'ADMIN') {
        router.push('/dashboard/overview');
        return;
      }

      // Simulate loading company data
      setTimeout(() => {
        const companyData = sampleCompanies[params.companyId];
        if (companyData) {
          setCompany(companyData);
        } else {
          router.push('/dashboard/overview');
        }
        setLoading(false);
      }, 500);
    }
  }, [isLoaded, user, params.companyId, router]);

  if (!isLoaded || loading) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium'>Loading company data...</div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!company) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium text-red-600'>
              Company not found
            </div>
            <Button
              onClick={() => router.push('/dashboard/overview')}
              className='mt-4'
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' ? (
      <Badge variant='outline' className='border-green-600 text-green-600'>
        Active
      </Badge>
    ) : (
      <Badge variant='outline' className='border-gray-600 text-gray-600'>
        Inactive
      </Badge>
    );
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {company.name}
            </h2>
            <p className='text-muted-foreground'>
              Company overview and key metrics
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() =>
                router.push(`/dashboard/company/${company.id}/profile`)
              }
            >
              Edit Profile
            </Button>
            <Button
              onClick={() =>
                router.push(`/dashboard/company/${company.id}/documents`)
              }
            >
              Upload Documents
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <IconCurrencyDollar className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${company.totalRevenue.toLocaleString()}
              </div>
              <p className='text-muted-foreground text-xs'>All time revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pending Invoices
              </CardTitle>
              <IconFileInvoice className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {company.pendingInvoices}
              </div>
              <p className='text-muted-foreground text-xs'>Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Completed Tasks
              </CardTitle>
              <IconCalendar className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{company.completedTasks}</div>
              <p className='text-muted-foreground text-xs'>Finished tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pending Tasks
              </CardTitle>
              <IconClock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{company.pendingTasks}</div>
              <p className='text-muted-foreground text-xs'>In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Company Information */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Status</span>
                {getStatusBadge(company.status)}
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Email</span>
                <span className='text-muted-foreground text-sm'>
                  {company.email}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Phone</span>
                <span className='text-muted-foreground text-sm'>
                  {company.phone}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Tax ID</span>
                <span className='text-muted-foreground text-sm'>
                  {company.taxId}
                </span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-sm font-medium'>Address</span>
                <span className='text-muted-foreground text-right text-sm'>
                  {company.address}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and important dates
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Last Invoice</span>
                <span className='text-muted-foreground text-sm'>
                  {new Date(company.lastInvoiceDate).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Next Due Date</span>
                <span className='text-muted-foreground text-sm'>
                  {company.nextDueDate === 'N/A'
                    ? 'N/A'
                    : new Date(company.nextDueDate).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Task Completion</span>
                <span className='text-muted-foreground text-sm'>
                  {Math.round(
                    (company.completedTasks /
                      (company.completedTasks + company.pendingTasks)) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Revenue Trend</span>
                <div className='flex items-center gap-1'>
                  <IconTrendingUp className='h-4 w-4 text-green-500' />
                  <span className='text-sm text-green-600'>+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for this company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={() =>
                  router.push(`/dashboard/company/${company.id}/documents`)
                }
              >
                Upload Documents
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push(`/dashboard/admin/tasks`)}
              >
                Create Task
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push(`/dashboard/admin/invoices`)}
              >
                Send Invoice
              </Button>
              <Button
                variant='outline'
                onClick={() =>
                  router.push(`/dashboard/company/${company.id}/profile`)
                }
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
