import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: true,
    shortcut: ['d', 'd'],
    items: [] // Overview of reports, tasks, KPIs
  },
  {
    title: 'Documents',
    url: '#',
    icon: 'page',
    isActive: false,
    shortcut: ['d', 'o'],
    items: [
      {
        title: 'Upload Documents',
        url: '/dashboard/documents/upload',
        icon: 'upload',
        shortcut: ['u', 'p']
      },
      {
        title: 'View Reports',
        url: '/dashboard/documents/reports',
        icon: 'post',
        shortcut: ['v', 'r']
      }
    ]
  },
  {
    title: 'Tasks',
    url: '/dashboard/tasks',
    icon: 'check',
    isActive: false,
    shortcut: ['t', 'a'],
    items: [] // Status of accounting-related tasks
  },
  {
    title: 'Messages',
    url: '/dashboard/messages',
    icon: 'message',
    isActive: false,
    shortcut: ['m', 's'],
    items: [] // Communication thread with accountant
  },
  {
    title: 'Deadlines',
    url: '/dashboard/deadlines',
    icon: 'calendar',
    isActive: false,
    shortcut: ['d', 'l'],
    items: [] // Calendar view of key tax/report deadlines
  },
  {
    title: 'Financials',
    url: '#',
    icon: 'chart',
    isActive: false,
    shortcut: ['f', 'n'],
    items: [
      {
        title: 'Revenue & Profit',
        url: '/dashboard/financials/revenue',
        icon: 'dashboard',
        shortcut: ['r', 'p']
      },
      {
        title: 'Tax Overview',
        url: '/dashboard/financials/tax',
        icon: 'receipt',
        shortcut: ['t', 'x']
      },
      {
        title: 'Export Data',
        url: '/dashboard/financials/export',
        icon: 'download',
        shortcut: ['e', 'x']
      }
    ]
  },
  {
    title: 'Account',
    url: '#',
    icon: 'user',
    isActive: false,
    shortcut: ['a', 'c'],
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['p', 'r']
      },
      {
        title: 'Company Info',
        url: '/dashboard/company/profile',
        icon: 'settings',
        shortcut: ['c', 'i']
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
