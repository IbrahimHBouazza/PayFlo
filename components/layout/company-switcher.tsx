'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { IconBuilding, IconChevronDown } from '@tabler/icons-react';

type Company = {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
};

// Sample companies data
const sampleCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'finance@acme.com',
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'TechStart Solutions',
    email: 'accounting@techstart.com',
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: 'Green Earth Industries',
    email: 'finance@greenearth.com',
    status: 'ACTIVE'
  },
  {
    id: '4',
    name: 'Global Trading Co',
    email: 'accounts@globaltrading.com',
    status: 'INACTIVE'
  }
];

export default function CompanySwitcher() {
  const { user, isLoaded } = useUser();
  const [selectedCompany, setSelectedCompany] = useState<string>('1');

  // Only show for admin users
  if (!isLoaded || !user || user.publicMetadata?.role !== 'ADMIN') {
    return null;
  }

  const currentCompany = sampleCompanies.find((c) => c.id === selectedCompany);

  return (
    <div className='border-border/40 border-b p-4'>
      <div className='mb-2 flex items-center gap-2'>
        <IconBuilding className='text-muted-foreground h-4 w-4' />
        <span className='text-muted-foreground text-sm font-medium'>
          Current Company
        </span>
      </div>

      <Select value={selectedCompany} onValueChange={setSelectedCompany}>
        <SelectTrigger className='w-full'>
          <SelectValue>
            <div className='flex items-center gap-2'>
              <IconBuilding className='h-4 w-4' />
              <span className='font-medium'>{currentCompany?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sampleCompanies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className='flex items-center gap-2'>
                <IconBuilding className='h-4 w-4' />
                <div>
                  <div className='font-medium'>{company.name}</div>
                  <div className='text-muted-foreground text-xs'>
                    {company.email}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='mt-2 flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          className='flex-1'
          onClick={() =>
            (window.location.href = `/dashboard/company/${selectedCompany}/overview`)
          }
        >
          Overview
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='flex-1'
          onClick={() =>
            (window.location.href = `/dashboard/company/${selectedCompany}/profile`)
          }
        >
          Profile
        </Button>
      </div>
    </div>
  );
}
