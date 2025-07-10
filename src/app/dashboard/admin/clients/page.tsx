'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  IconBuilding,
  IconMail,
  IconPhone,
  IconFileInvoice,
  IconCalendar
} from '@tabler/icons-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type ClientFormValues = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  status: string;
  lastInvoice?: string;
  totalRevenue?: number;
  pendingTasks?: number;
};

// Sample accounting agency client data
const sampleClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'finance@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    taxId: '12-3456789',
    status: 'ACTIVE',
    lastInvoice: '2024-01-15',
    totalRevenue: 125000,
    pendingTasks: 2
  },
  {
    id: '2',
    name: 'TechStart Solutions',
    email: 'accounting@techstart.com',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Dr, San Francisco, CA 94102',
    taxId: '98-7654321',
    status: 'ACTIVE',
    lastInvoice: '2024-01-10',
    totalRevenue: 89000,
    pendingTasks: 1
  },
  {
    id: '3',
    name: 'Green Earth Industries',
    email: 'finance@greenearth.com',
    phone: '+1 (555) 456-7890',
    address: '789 Eco Way, Portland, OR 97201',
    taxId: '45-6789012',
    status: 'ACTIVE',
    lastInvoice: '2024-01-20',
    totalRevenue: 210000,
    pendingTasks: 3
  },
  {
    id: '4',
    name: 'Global Trading Co',
    email: 'accounts@globaltrading.com',
    phone: '+1 (555) 321-0987',
    address: '321 Commerce St, Chicago, IL 60601',
    taxId: '32-1098765',
    status: 'INACTIVE',
    lastInvoice: '2023-12-15',
    totalRevenue: 75000,
    pendingTasks: 0
  }
];

export default function AdminClientsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ClientFormValues>({
    defaultValues: { name: '', email: '', phone: '', address: '', taxId: '' }
  });

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/clients');
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching clients');
      // Fallback to sample data if API fails
      setClients(sampleClients);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  useEffect(() => {
    if (isLoaded && user) {
      // Check if user has admin role in public metadata
      const userRole = user.publicMetadata?.role as string;
      if (userRole !== 'ADMIN') {
        // Redirect non-admin users to overview page
        router.push('/dashboard/overview');
      }
    }
  }, [isLoaded, user, router]);

  // Fetch clients when user is admin
  useEffect(() => {
    if (user?.publicMetadata?.role === 'ADMIN') {
      fetchClients();
    }
  }, [user]);

  // Show loading while checking user role
  if (!isLoaded) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium'>Loading...</div>
            <div className='text-muted-foreground text-sm'>
              Checking permissions
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Show access denied if user is not admin
  if (isLoaded && user && user.publicMetadata?.role !== 'ADMIN') {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium text-red-600'>
              Access Denied
            </div>
            <div className='text-muted-foreground text-sm'>
              You don&apos;t have permission to view this page
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

  const handleAddClient = async (values: ClientFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) throw new Error('Failed to add client');
      setIsModalOpen(false);
      form.reset();
      await fetchClients();
    } catch (err: any) {
      setError(err.message || 'Error adding client');
      // For demo purposes, add to local state if API fails
      const newClient: Client = {
        id: Date.now().toString(),
        ...values,
        status: 'ACTIVE',
        totalRevenue: 0,
        pendingTasks: 0
      };
      setClients((prev) => [newClient, ...prev]);
      setIsModalOpen(false);
      form.reset();
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant='outline' className='border-green-600 text-green-600'>
            Active
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge variant='outline' className='border-gray-600 text-gray-600'>
            Inactive
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Client Management
            </h2>
            <p className='text-muted-foreground'>
              Manage your accounting clients and their accounts
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className='flex items-center gap-2'
          >
            <IconBuilding className='h-4 w-4' />
            Add Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Clients
              </CardTitle>
              <IconBuilding className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{clients.length}</div>
              <p className='text-muted-foreground text-xs'>Active accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Clients
              </CardTitle>
              <IconFileInvoice className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {clients.filter((c) => c.status === 'ACTIVE').length}
              </div>
              <p className='text-muted-foreground text-xs'>Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <IconCalendar className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                $
                {clients
                  .reduce((sum, client) => sum + (client.totalRevenue || 0), 0)
                  .toLocaleString()}
              </div>
              <p className='text-muted-foreground text-xs'>From all clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pending Tasks
              </CardTitle>
              <IconFileInvoice className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {clients.reduce(
                  (sum, client) => sum + (client.pendingTasks || 0),
                  0
                )}
              </div>
              <p className='text-muted-foreground text-xs'>
                Across all clients
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Accounts</CardTitle>
            <CardDescription>
              Manage your client relationships and view their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-600'>
                {error}
              </div>
            )}
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='p-3 text-left font-medium'>Client</th>
                    <th className='p-3 text-left font-medium'>Contact</th>
                    <th className='p-3 text-left font-medium'>Status</th>
                    <th className='p-3 text-left font-medium'>Revenue</th>
                    <th className='p-3 text-left font-medium'>Tasks</th>
                    <th className='p-3 text-left font-medium'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='text-muted-foreground p-6 text-center'
                      >
                        Loading clients...
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='text-muted-foreground p-6 text-center'
                      >
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr
                        key={client.id}
                        className='hover:bg-muted/50 border-b'
                      >
                        <td className='p-3'>
                          <div>
                            <div className='font-medium'>{client.name}</div>
                            <div className='text-muted-foreground text-sm'>
                              {client.taxId}
                            </div>
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='flex items-center gap-2 text-sm'>
                            <IconMail className='h-4 w-4' />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                              <IconPhone className='h-4 w-4' />
                              {client.phone}
                            </div>
                          )}
                        </td>
                        <td className='p-3'>{getStatusBadge(client.status)}</td>
                        <td className='p-3'>
                          <div className='font-medium'>
                            ${client.totalRevenue?.toLocaleString() || '0'}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            Total revenue
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='font-medium'>
                            {client.pendingTasks || 0}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            Pending tasks
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='flex gap-2'>
                            <Button variant='outline' size='sm'>
                              View
                            </Button>
                            <Button variant='outline' size='sm'>
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Modal
          title='Add New Client'
          description='Create a new client account for your accounting services.'
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddClient)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter company name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='finance@company.com'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='+1 (555) 123-4567' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123 Business St, City, State ZIP'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='taxId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID / EIN</FormLabel>
                    <FormControl>
                      <Input placeholder='12-3456789' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Client'}
                </Button>
              </div>
            </form>
          </Form>
        </Modal>
      </div>
    </PageContainer>
  );
}
