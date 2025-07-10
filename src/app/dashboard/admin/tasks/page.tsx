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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  IconPlus,
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconBuilding,
  IconCalendar,
  IconFlag
} from '@tabler/icons-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type TaskFormValues = {
  clientId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  clientName: string;
  assignedTo: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
};

// Sample data
const sampleClients: Client[] = [
  { id: '1', name: 'Acme Corporation', email: 'finance@acme.com' },
  { id: '2', name: 'TechStart Solutions', email: 'accounting@techstart.com' },
  { id: '3', name: 'Green Earth Industries', email: 'finance@greenearth.com' },
  { id: '4', name: 'Global Trading Co', email: 'accounts@globaltrading.com' }
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'VAT Return Submission',
    description: 'Prepare and submit Q4 2023 VAT return for Acme Corporation',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '2024-01-31',
    completedAt: '2024-01-28T14:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    clientName: 'Acme Corporation',
    assignedTo: 'Admin User'
  },
  {
    id: '2',
    title: 'Annual Accounts Review',
    description: 'Review and finalize annual accounts for TechStart Solutions',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    dueDate: '2024-02-15',
    createdAt: '2024-01-20T09:00:00Z',
    clientName: 'TechStart Solutions',
    assignedTo: 'Admin User'
  },
  {
    id: '3',
    title: 'Tax Planning Consultation',
    description:
      'Schedule and conduct tax planning consultation for Green Earth Industries',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: '2024-02-28',
    createdAt: '2024-01-25T16:00:00Z',
    clientName: 'Green Earth Industries',
    assignedTo: 'Admin User'
  },
  {
    id: '4',
    title: 'Payroll Processing',
    description: 'Process monthly payroll for Global Trading Co',
    status: 'PENDING',
    priority: 'HIGH',
    dueDate: '2024-02-01',
    createdAt: '2024-01-30T11:00:00Z',
    clientName: 'Global Trading Co',
    assignedTo: 'Admin User'
  }
];

export default function AdminTasksPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TaskFormValues>({
    defaultValues: {
      clientId: '',
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: ''
    }
  });

  // Check if user is admin
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role as string;
      if (userRole !== 'ADMIN') {
        router.push('/dashboard/overview');
      }
    }
  }, [isLoaded, user, router]);

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

  if (isLoaded && user && user.publicMetadata?.role !== 'ADMIN') {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium text-red-600'>
              Access Denied
            </div>
            <div className='text-muted-foreground text-sm'>
              You don't have permission to view this page
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
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant='outline'
            className='border-yellow-600 text-yellow-600'
          >
            Pending
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant='outline' className='border-blue-600 text-blue-600'>
            In Progress
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant='outline' className='border-green-600 text-green-600'>
            Completed
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant='outline' className='border-gray-600 text-gray-600'>
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return (
          <Badge variant='outline' className='border-gray-600 text-gray-600'>
            Low
          </Badge>
        );
      case 'MEDIUM':
        return (
          <Badge variant='outline' className='border-blue-600 text-blue-600'>
            Medium
          </Badge>
        );
      case 'HIGH':
        return (
          <Badge
            variant='outline'
            className='border-orange-600 text-orange-600'
          >
            High
          </Badge>
        );
      case 'URGENT':
        return (
          <Badge variant='outline' className='border-red-600 text-red-600'>
            Urgent
          </Badge>
        );
      default:
        return <Badge variant='outline'>{priority}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return <IconFlag className='h-4 w-4 text-gray-500' />;
      case 'MEDIUM':
        return <IconFlag className='h-4 w-4 text-blue-500' />;
      case 'HIGH':
        return <IconFlag className='h-4 w-4 text-orange-500' />;
      case 'URGENT':
        return <IconAlertTriangle className='h-4 w-4 text-red-500' />;
      default:
        return <IconFlag className='h-4 w-4' />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return (
      new Date(dueDate) < new Date() &&
      !tasks.find((t) => t.id === dueDate)?.completedAt
    );
  };

  const handleCreateTask = async (values: TaskFormValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: values.title,
        description: values.description,
        status: 'PENDING',
        priority: values.priority as any,
        dueDate: values.dueDate,
        createdAt: new Date().toISOString(),
        clientName:
          clients.find((c) => c.id === values.clientId)?.name ||
          'Unknown Client',
        assignedTo: user?.fullName || 'Admin User'
      };

      setTasks((prev) => [newTask, ...prev]);
      setIsModalOpen(false);
      form.reset();
    } catch (err: any) {
      setError(err.message || 'Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completedAt:
              newStatus === 'COMPLETED' ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Task Management
            </h2>
            <p className='text-muted-foreground'>
              Create and manage tasks and updates for your clients
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className='flex items-center gap-2'
          >
            <IconPlus className='h-4 w-4' />
            Create Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Tasks</CardTitle>
              <IconCalendar className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{tasks.length}</div>
              <p className='text-muted-foreground text-xs'>All tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pending</CardTitle>
              <IconClock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {getTasksByStatus('PENDING').length}
              </div>
              <p className='text-muted-foreground text-xs'>Awaiting action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>In Progress</CardTitle>
              <IconClock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {getTasksByStatus('IN_PROGRESS').length}
              </div>
              <p className='text-muted-foreground text-xs'>Currently working</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Completed</CardTitle>
              <IconCheck className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {getTasksByStatus('COMPLETED').length}
              </div>
              <p className='text-muted-foreground text-xs'>Finished tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Tasks</CardTitle>
            <CardDescription>
              Manage tasks and track progress for your clients
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
                    <th className='p-3 text-left font-medium'>Task</th>
                    <th className='p-3 text-left font-medium'>Client</th>
                    <th className='p-3 text-left font-medium'>Priority</th>
                    <th className='p-3 text-left font-medium'>Status</th>
                    <th className='p-3 text-left font-medium'>Due Date</th>
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
                        Loading tasks...
                      </td>
                    </tr>
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='text-muted-foreground p-6 text-center'
                      >
                        No tasks found.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task.id} className='hover:bg-muted/50 border-b'>
                        <td className='p-3'>
                          <div className='flex items-center gap-2'>
                            {getPriorityIcon(task.priority)}
                            <div>
                              <div className='font-medium'>{task.title}</div>
                              <div className='text-muted-foreground text-sm'>
                                {task.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='font-medium'>{task.clientName}</div>
                          <div className='text-muted-foreground text-sm'>
                            Assigned to {task.assignedTo}
                          </div>
                        </td>
                        <td className='p-3'>
                          {getPriorityBadge(task.priority)}
                        </td>
                        <td className='p-3'>{getStatusBadge(task.status)}</td>
                        <td className='p-3'>
                          <div
                            className={`font-medium ${isOverdue(task.dueDate) ? 'text-red-600' : ''}`}
                          >
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          {isOverdue(task.dueDate) && (
                            <div className='text-sm text-red-600'>Overdue</div>
                          )}
                        </td>
                        <td className='p-3'>
                          <div className='flex gap-2'>
                            {task.status !== 'COMPLETED' && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  handleStatusChange(task.id, 'COMPLETED')
                                }
                                className='flex items-center gap-1 text-green-600'
                              >
                                <IconCheck className='h-3 w-3' />
                                Complete
                              </Button>
                            )}
                            {task.status === 'PENDING' && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  handleStatusChange(task.id, 'IN_PROGRESS')
                                }
                              >
                                Start
                              </Button>
                            )}
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(task.id)}
                              className='flex items-center gap-1 text-red-600 hover:text-red-700'
                            >
                              Delete
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
          title='Create New Task'
          description='Create a new task or update for a client.'
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateTask)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='clientId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Choose a client' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter task title' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the task or update'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select priority' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='LOW'>Low</SelectItem>
                        <SelectItem value='MEDIUM'>Medium</SelectItem>
                        <SelectItem value='HIGH'>High</SelectItem>
                        <SelectItem value='URGENT'>Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsModalOpen(false);
                    form.reset();
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </Form>
        </Modal>
      </div>
    </PageContainer>
  );
}
