'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconAlertTriangle, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export function DevBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Check if Clerk is properly configured (has real keys, not placeholder)
  const isClerkConfigured =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_');

  if (isClerkConfigured || !isVisible) {
    return null;
  }

  return (
    <Alert className='border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'>
      <IconAlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
      <AlertDescription className='flex items-center justify-between'>
        <div className='flex-1'>
          <strong>Development Mode:</strong> Authentication is disabled.
          <Button
            variant='link'
            className='h-auto p-0 text-yellow-600 underline dark:text-yellow-400'
            onClick={() => window.open('/CLERK_SETUP.md', '_blank')}
          >
            Set up Clerk authentication
          </Button>{' '}
          to enable user login and protected routes.
        </div>
        <Button
          variant='ghost'
          size='sm'
          className='h-6 w-6 p-0 text-yellow-600 dark:text-yellow-400'
          onClick={() => setIsVisible(false)}
        >
          <IconX className='h-4 w-4' />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
