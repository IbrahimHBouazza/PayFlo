'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  IconBuilding,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconCalendar,
  IconCircleCheck,
  IconCircleX,
  IconPlus
} from '@tabler/icons-react';

const placeholderLogo =
  'https://ui-avatars.com/api/?name=Company&background=random';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    logo_url: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    year_established: '',
    status: 'ACTIVE'
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/companies');
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
    } catch (e: any) {
      setError(e.message || 'Error loading clients');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add client');
      }
      setShowModal(false);
      setForm({
        name: '',
        logo_url: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        industry: '',
        year_established: '',
        status: 'ACTIVE'
      });
      fetchClients();
    } catch (e: any) {
      setFormError(e.message || 'Error adding client');
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>All Clients</h2>
          <Button
            onClick={() => setShowModal(true)}
            className='flex items-center gap-2'
          >
            <IconPlus className='h-4 w-4' /> Add Client
          </Button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className='text-red-600'>{error}</div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {clients.map((client) => (
              <Card
                key={client.id}
                className='flex flex-col items-center rounded-xl border bg-white p-6 shadow-lg'
              >
                <img
                  src={client.logo_url || placeholderLogo}
                  alt={client.name}
                  className='mb-3 h-16 w-16 rounded-full border object-cover shadow'
                />
                <CardHeader className='items-center text-center'>
                  <CardTitle className='flex items-center gap-2 text-lg font-bold'>
                    <IconBuilding className='inline-block text-gray-400' />{' '}
                    {client.name}
                  </CardTitle>
                  <CardDescription className='mt-1 flex items-center gap-2'>
                    <IconUser className='inline-block text-gray-400' />{' '}
                    {client.contact_person || 'N/A'}
                  </CardDescription>
                </CardHeader>
                <div className='mt-2 flex w-full flex-col gap-1 text-sm text-gray-700'>
                  <div className='flex items-center gap-2'>
                    <IconMail className='inline-block text-gray-400' />{' '}
                    {client.email}
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconPhone className='inline-block text-gray-400' />{' '}
                    {client.phone || 'N/A'}
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconMapPin className='inline-block text-gray-400' />{' '}
                    {client.address || 'N/A'}
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconBriefcase className='inline-block text-gray-400' />{' '}
                    {client.industry || 'N/A'}
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconCalendar className='inline-block text-gray-400' />{' '}
                    {client.year_established || 'N/A'}
                  </div>
                  <div className='flex items-center gap-2'>
                    {client.status === 'ACTIVE' ? (
                      <>
                        <IconCircleCheck className='inline-block text-green-500' />{' '}
                        <span className='text-green-600'>Active</span>
                      </>
                    ) : (
                      <>
                        <IconCircleX className='inline-block text-red-500' />{' '}
                        <span className='text-red-600'>Inactive</span>
                      </>
                    )}
                  </div>
                </div>
                <CardFooter className='mt-4 flex w-full justify-center'>
                  {/* Add actions like View, Edit, etc. here if needed */}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddClient} className='space-y-3'>
            <Input
              placeholder='Company Name'
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              placeholder='Logo URL (optional)'
              value={form.logo_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, logo_url: e.target.value }))
              }
            />
            <Input
              placeholder='Contact Person'
              value={form.contact_person}
              onChange={(e) =>
                setForm((f) => ({ ...f, contact_person: e.target.value }))
              }
            />
            <Input
              placeholder='Email'
              type='email'
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <Input
              placeholder='Phone'
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Input
              placeholder='Address'
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
            />
            <Input
              placeholder='Industry'
              value={form.industry}
              onChange={(e) =>
                setForm((f) => ({ ...f, industry: e.target.value }))
              }
            />
            <Input
              placeholder='Year Established'
              type='number'
              value={form.year_established}
              onChange={(e) =>
                setForm((f) => ({ ...f, year_established: e.target.value }))
              }
            />
            <select
              className='w-full rounded border px-2 py-1'
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value='ACTIVE'>ACTIVE</option>
              <option value='INACTIVE'>INACTIVE</option>
            </select>
            {formError && (
              <div className='text-sm text-red-600'>{formError}</div>
            )}
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={formLoading}>
                {formLoading ? 'Adding...' : 'Add Client'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
