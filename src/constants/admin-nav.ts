import { NavItem } from '@/types';

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'dashboard',
    isActive: true,
    items: []
  },
  {
    title: 'Clients',
    url: '/admin/clients',
    icon: 'user',
    isActive: false,
    items: []
  },
  {
    title: 'Documents',
    url: '/admin/documents',
    icon: 'page',
    isActive: false,
    items: []
  },
  {
    title: 'Tasks',
    url: '/admin/tasks',
    icon: 'check',
    isActive: false,
    items: []
  },
  {
    title: 'Messages',
    url: '/admin/messages',
    icon: 'message',
    isActive: false,
    items: []
  },
  {
    title: 'Deadlines',
    url: '/admin/deadlines',
    icon: 'calendar',
    isActive: false,
    items: []
  },
  {
    title: 'Financial Overview',
    url: '/admin/financial',
    icon: 'chart',
    isActive: false,
    items: []
  },
  {
    title: 'Firm Settings',
    url: '/admin/settings',
    icon: 'settings',
    isActive: false,
    items: []
  },
  {
    title: 'My Profile',
    url: '/admin/profile',
    icon: 'user',
    isActive: false,
    items: []
  }
];
