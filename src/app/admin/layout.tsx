import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { adminNavItems } from '@/constants/admin-nav';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <AppSidebar navItems={adminNavItems} />
        <main className='bg-background flex-1'>{children}</main>
      </div>
    </SidebarProvider>
  );
}
