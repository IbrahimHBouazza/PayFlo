'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconCrown, IconUser, IconRefresh } from '@tabler/icons-react';
import PageContainer from '@/components/layout/page-container';

export default function RoleSwitcherPage() {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isLoaded) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium'>Loading...</div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium text-red-600'>
              Not authenticated
            </div>
            <div className='text-muted-foreground text-sm'>
              Please sign in to access this page
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  const currentRole = (user.publicMetadata?.role as string) || 'CLIENT';

  const updateRole = async (newRole: string) => {
    setIsUpdating(true);
    setMessage(null);

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: newRole
        }
      });

      setMessage({
        type: 'success',
        text: `Role updated to ${newRole}! Please refresh the page to see changes.`
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update role. Please try again.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Role Management</h2>
          <p className='text-muted-foreground'>
            Switch between admin and user roles for testing
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Account</CardTitle>
            <CardDescription>
              Manage your user role and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='flex-1'>
                <div className='font-medium'>
                  {user.fullName || user.emailAddresses[0]?.emailAddress}
                </div>
                <div className='text-muted-foreground text-sm'>
                  {user.emailAddresses[0]?.emailAddress}
                </div>
              </div>
              <Badge variant='outline' className='flex items-center gap-1'>
                {currentRole === 'ADMIN' ? (
                  <>
                    <IconCrown className='h-3 w-3' />
                    Admin
                  </>
                ) : (
                  <>
                    <IconUser className='h-3 w-3' />
                    Client
                  </>
                )}
              </Badge>
            </div>

            <div className='border-t pt-4'>
              <h3 className='mb-3 font-medium'>Switch Role</h3>
              <div className='flex gap-3'>
                <Button
                  onClick={() => updateRole('ADMIN')}
                  disabled={isUpdating || currentRole === 'ADMIN'}
                  className='flex items-center gap-2'
                  variant={currentRole === 'ADMIN' ? 'default' : 'outline'}
                >
                  <IconCrown className='h-4 w-4' />
                  Make Admin
                </Button>
                <Button
                  onClick={() => updateRole('CLIENT')}
                  disabled={isUpdating || currentRole === 'CLIENT'}
                  className='flex items-center gap-2'
                  variant={currentRole === 'CLIENT' ? 'default' : 'outline'}
                >
                  <IconUser className='h-4 w-4' />
                  Make Client
                </Button>
                <Button
                  onClick={refreshPage}
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  <IconRefresh className='h-4 w-4' />
                  Refresh
                </Button>
              </div>
            </div>

            {message && (
              <div
                className={`rounded-md p-3 ${
                  message.type === 'success'
                    ? 'border border-green-200 bg-green-50 text-green-800'
                    : 'border border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className='border-t pt-4'>
              <h3 className='mb-2 font-medium'>Role Permissions</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <IconCrown className='h-4 w-4 text-blue-600' />
                  <span>
                    <strong>Admin:</strong> Access to client management, file
                    uploads, task creation, and all admin features
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <IconUser className='h-4 w-4 text-gray-600' />
                  <span>
                    <strong>Client:</strong> Access to dashboard overview and
                    client portal features
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div>
              <strong>1. Switch to Admin:</strong> Click "Make Admin" to access
              admin features
            </div>
            <div>
              <strong>2. Test Admin Features:</strong> Navigate to Admin &gt;
              Clients, Files, or Tasks
            </div>
            <div>
              <strong>3. Switch to Client:</strong> Click "Make Client" to test
              client experience
            </div>
            <div>
              <strong>4. Refresh:</strong> Use the refresh button to see role
              changes immediately
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
