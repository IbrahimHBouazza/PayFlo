'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconUsers,
  IconFolder,
  IconClipboardList,
  IconMessageDots,
  IconCalendar,
  IconChartBar,
  IconSettings,
  IconUser
} from '@tabler/icons-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <IconHome /> },
  { label: 'Clients', href: '/admin/clients', icon: <IconUsers /> },
  { label: 'Documents', href: '/admin/documents', icon: <IconFolder /> },
  { label: 'Tasks', href: '/admin/tasks', icon: <IconClipboardList /> },
  { label: 'Messages', href: '/admin/messages', icon: <IconMessageDots /> },
  { label: 'Deadlines', href: '/admin/deadlines', icon: <IconCalendar /> },
  {
    label: 'Financial Overview',
    href: '/admin/financial',
    icon: <IconChartBar />
  },
  { label: 'Firm Settings', href: '/admin/settings', icon: <IconSettings /> },
  { label: 'My Profile', href: '/admin/profile', icon: <IconUser /> }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className='flex min-h-screen w-64 flex-col border-r bg-white'>
      <div className='p-6 text-xl font-bold'>Admin Panel</div>
      <nav className='flex-1'>
        <ul className='space-y-1'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded px-4 py-2 transition-colors hover:bg-gray-100 ${pathname === item.href ? 'bg-gray-200 font-semibold' : ''}`}
              >
                <span className='h-5 w-5'>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
