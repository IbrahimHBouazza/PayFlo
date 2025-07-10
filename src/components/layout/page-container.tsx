import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isSupabaseConfigured } from '../../../lib/supabase';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {!isSupabaseConfigured && (
        <div className='border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800'>
          <div className='flex items-center justify-between'>
            <span>
              🚧 Development Mode: Using mock data.
              <a
                href='/SUPABASE_SETUP.md'
                className='ml-1 underline hover:text-yellow-900'
                target='_blank'
                rel='noopener noreferrer'
              >
                Set up Supabase
              </a>{' '}
              to connect to a real database.
            </span>
          </div>
        </div>
      )}
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)]'>
          <div className='flex flex-1 p-4 md:px-6'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex flex-1 p-4 md:px-6'>{children}</div>
      )}
    </>
  );
}
