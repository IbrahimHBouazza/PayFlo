'use client';
import { useUser } from '@clerk/nextjs';

export default function AdminProtected({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <div>Loading...</div>;
  if (
    !user ||
    user.primaryEmailAddress?.emailAddress !== 'bouazza287173@gmail.com'
  ) {
    return <div className='p-8 text-center text-lg'>Access denied</div>;
  }
  return <>{children}</>;
}
