'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconFileInvoice,
  IconUpload,
  IconCheck,
  IconClock,
  IconAlertTriangle
} from '@tabler/icons-react';
import { useDashboardOverview } from '@/hooks/use-api';
import { formatDistanceToNow } from 'date-fns';

// For now, we'll use a hardcoded company ID - in a real app, this would come from user context
const DEMO_COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <Badge variant='default' className='text-xs'>
          Completed
        </Badge>
      );
    case 'TODO':
      return (
        <Badge variant='secondary' className='text-xs'>
          Pending
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant='outline' className='text-xs'>
          In Progress
        </Badge>
      );
    case 'WAITING_ON_CLIENT':
      return (
        <Badge variant='destructive' className='text-xs'>
          Waiting
        </Badge>
      );
    default:
      return (
        <Badge variant='outline' className='text-xs'>
          {status}
        </Badge>
      );
  }
};

const getTaskIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return IconCheck;
    case 'IN_PROGRESS':
      return IconClock;
    case 'WAITING_ON_CLIENT':
      return IconAlertTriangle;
    default:
      return IconFileInvoice;
  }
};

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  due_date: string;
  assigned_to?: string;
}

export function RecentSales() {
  const {
    data: overview,
    loading,
    error
  } = useDashboardOverview(DEMO_COMPANY_ID);

  if (loading) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and completed tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex animate-pulse items-center gap-4'>
                <div className='h-9 w-9 rounded-full bg-gray-200'></div>
                <div className='ml-4 flex-1 space-y-1'>
                  <div className='flex items-center justify-between'>
                    <div className='h-4 w-3/4 rounded bg-gray-200'></div>
                    <div className='h-5 w-16 rounded bg-gray-200'></div>
                  </div>
                  <div className='h-3 w-1/2 rounded bg-gray-200'></div>
                  <div className='h-3 w-1/4 rounded bg-gray-200'></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and completed tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex h-32 items-center justify-center'>
            <div className='text-center'>
              <IconAlertTriangle className='mx-auto mb-2 h-8 w-8 text-red-500' />
              <p className='text-muted-foreground text-sm'>
                Failed to load recent activity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentTasks = overview?.recent?.tasks || [];
  const upcomingDeadlines = overview?.recent?.deadlines || [];

  // Combine recent tasks and upcoming deadlines for a comprehensive activity feed
  const activities = [
    ...recentTasks.map((task: Task) => ({
      id: task.id,
      type: 'task',
      title: task.title,
      description: task.description || 'Task activity',
      status: task.status,
      date: task.created_at,
      assignedTo: task.assigned_to,
      isDeadline: false
    })),
    ...upcomingDeadlines.map((task: Task) => ({
      id: `deadline-${task.id}`,
      type: 'deadline',
      title: task.title,
      description: `Due: ${new Date(task.due_date).toLocaleDateString()}`,
      status: task.status,
      date: task.due_date,
      assignedTo: task.assigned_to,
      isDeadline: true
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (activities.length === 0) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and completed tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex h-32 items-center justify-center'>
            <div className='text-center'>
              <IconClock className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
              <p className='text-muted-foreground text-sm'>
                No recent activity
              </p>
              <p className='text-muted-foreground text-xs'>
                Tasks and deadlines will appear here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and completed tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {activities.map((activity) => {
            const IconComponent = getTaskIcon(activity.status);
            const timeAgo = formatDistanceToNow(new Date(activity.date), {
              addSuffix: true
            });

            return (
              <div key={activity.id} className='flex items-center gap-4'>
                <Avatar className='h-9 w-9'>
                  <AvatarFallback
                    className={`${activity.isDeadline ? 'bg-orange-100 text-orange-600' : 'bg-primary/10'}`}
                  >
                    <IconComponent className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                <div className='ml-4 flex-1 space-y-1'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm leading-none font-medium'>
                      {activity.title}
                    </p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {activity.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <p className='text-muted-foreground text-xs'>{timeAgo}</p>
                    {activity.assignedTo && (
                      <p className='text-muted-foreground text-xs'>
                        Assigned to {activity.assignedTo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
