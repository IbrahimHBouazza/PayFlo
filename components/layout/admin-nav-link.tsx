'use client';

import { useUser } from '@clerk/nextjs';

export default function AdminNavLink() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user || user.publicMetadata?.role !== 'ADMIN') {
    return null;
  }

  return (
    <nav className='border-border/40 border-b px-4 py-2'>
      <div className='flex gap-4'>
        <a
          href='/dashboard/admin/clients'
          className='text-sm font-medium text-blue-600 hover:underline'
        >
          Admin &gt; Clients
        </a>
        <a
          href='/dashboard/admin/files'
          className='text-sm font-medium text-blue-600 hover:underline'
        >
          Admin &gt; Files
        </a>
        <a
          href='/dashboard/admin/tasks'
          className='text-sm font-medium text-blue-600 hover:underline'
        >
          Admin &gt; Tasks
        </a>
        <a
          href='/dashboard/profile/role-switcher'
          className='text-sm font-medium text-orange-600 hover:underline'
        >
          Role Switcher
        </a>
      </div>
    </nav>
  );
}
