'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  IconUsers,
  IconFolder,
  IconClipboardList,
  IconChartBar
} from '@tabler/icons-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    clients: 0,
    documents: 0,
    pendingTasks: 0,
    revenue: 0,
    loading: true,
    error: ''
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [clientsRes, docsRes, tasksRes, finRes] = await Promise.all([
          fetch('/api/admin/clients/count'),
          fetch('/api/admin/documents/count'),
          fetch('/api/admin/tasks/pending'),
          fetch('/api/admin/financial/revenue')
        ]);
        const clients = await clientsRes.json();
        const documents = await docsRes.json();
        const pendingTasks = await tasksRes.json();
        const revenue = await finRes.json();
        setStats({
          clients: clients.count || 0,
          documents: documents.count || 0,
          pendingTasks: pendingTasks.count || 0,
          revenue: revenue.total || 0,
          loading: false,
          error: ''
        });
      } catch (e) {
        setStats((s) => ({
          ...s,
          loading: false,
          error: 'Failed to load admin stats'
        }));
      }
    }
    fetchStats();
  }, []);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <h2 className='mb-4 text-2xl font-bold tracking-tight'>
          Firm Overview
        </h2>
        {stats.loading ? (
          <div>Loading...</div>
        ) : stats.error ? (
          <div className='text-red-600'>{stats.error}</div>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader>
                <CardDescription>Total Clients</CardDescription>
                <CardTitle className='flex items-center gap-2 text-2xl font-semibold'>
                  <IconUsers className='inline-block' /> {stats.clients}
                </CardTitle>
              </CardHeader>
              <CardFooter>All companies in the system</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Documents</CardDescription>
                <CardTitle className='flex items-center gap-2 text-2xl font-semibold'>
                  <IconFolder className='inline-block' /> {stats.documents}
                </CardTitle>
              </CardHeader>
              <CardFooter>All uploaded documents</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Pending Tasks</CardDescription>
                <CardTitle className='flex items-center gap-2 text-2xl font-semibold'>
                  <IconClipboardList className='inline-block' />{' '}
                  {stats.pendingTasks}
                </CardTitle>
              </CardHeader>
              <CardFooter>Tasks not yet completed</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Firm Revenue</CardDescription>
                <CardTitle className='flex items-center gap-2 text-2xl font-semibold'>
                  <IconChartBar className='inline-block' /> $
                  {stats.revenue.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardFooter>Total revenue (all clients)</CardFooter>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
