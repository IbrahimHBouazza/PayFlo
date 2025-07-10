'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import {
  IconBuilding,
  IconDeviceFloppy,
  IconArrowLeft,
  IconUser,
  IconBell,
  IconShield,
  IconMail
} from '@tabler/icons-react';

type ClientCompany = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  contactPerson: string;
  industry: string;
  yearEstablished: number;
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    reportAlerts: boolean;
    taskUpdates: boolean;
    messageAlerts: boolean;
  };
  lastLogin: string;
  accountStatus: 'ACTIVE' | 'INACTIVE';
};

type ClientProfileFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  contactPerson: string;
  industry: string;
  yearEstablished: number;
};

type NotificationFormValues = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  reportAlerts: boolean;
  taskUpdates: boolean;
  messageAlerts: boolean;
};

// Sample client company data
const sampleClientCompany: ClientCompany = {
  id: '1',
  name: 'Acme Corporation',
  email: 'finance@acme.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business Ave, New York, NY 10001',
  taxId: '12-3456789',
  contactPerson: 'John Smith',
  industry: 'Technology',
  yearEstablished: 2018,
  notificationPreferences: {
    emailNotifications: true,
    smsNotifications: false,
    reportAlerts: true,
    taskUpdates: true,
    messageAlerts: true
  },
  lastLogin: '2024-01-15T10:30:00Z',
  accountStatus: 'ACTIVE'
};

export default function ClientProfilePage({
  params
}: {
  params: { companyId: string };
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [company, setCompany] = useState<ClientCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const profileForm = useForm<ClientProfileFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      contactPerson: '',
      industry: '',
      yearEstablished: 2020
    }
  });

  const notificationForm = useForm<NotificationFormValues>({
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      reportAlerts: true,
      taskUpdates: true,
      messageAlerts: true
    }
  });

  useEffect(() => {
    if (isLoaded && user) {
      // Simulate loading company data
      setTimeout(() => {
        setCompany(sampleClientCompany);
        // Set form values
        profileForm.reset({
          name: sampleClientCompany.name,
          email: sampleClientCompany.email,
          phone: sampleClientCompany.phone,
          address: sampleClientCompany.address,
          taxId: sampleClientCompany.taxId,
          contactPerson: sampleClientCompany.contactPerson,
          industry: sampleClientCompany.industry,
          yearEstablished: sampleClientCompany.yearEstablished
        });
        notificationForm.reset(sampleClientCompany.notificationPreferences);
        setLoading(false);
      }, 500);
    }
  }, [isLoaded, user, profileForm, notificationForm]);

  const handleProfileSave = async (values: ClientProfileFormValues) => {
    setSaving(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      if (company) {
        const updatedCompany = { ...company, ...values };
        setCompany(updatedCompany);
      }

      setMessage({
        type: 'success',
        text: 'Company profile updated successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update company profile. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async (values: NotificationFormValues) => {
    setSaving(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      if (company) {
        const updatedCompany = {
          ...company,
          notificationPreferences: values
        };
        setCompany(updatedCompany);
      }

      setMessage({
        type: 'success',
        text: 'Notification preferences updated successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update notification preferences. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium'>Loading your profile...</div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!company) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium text-red-600'>
              Profile not found
            </div>
            <Button
              onClick={() => router.push('/dashboard/overview')}
              className='mt-4'
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between space-y-2'>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push('/dashboard/overview')}
              className='flex items-center gap-2'
            >
              <IconArrowLeft className='h-4 w-4' />
              Back to Dashboard
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Profile & Settings
              </h2>
              <p className='text-muted-foreground'>
                Manage your company information and preferences
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === 'success'
                ? 'border border-green-200 bg-green-50 text-green-800'
                : 'border border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Account Status Card */}
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-3'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Account Status</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {company.accountStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
              </CardTitle>
              <Badge
                variant={
                  company.accountStatus === 'ACTIVE' ? 'default' : 'secondary'
                }
              >
                {company.accountStatus === 'ACTIVE'
                  ? 'All Services Available'
                  : 'Limited Access'}
              </Badge>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Last login: {new Date(company.lastLogin).toLocaleDateString()}
              </div>
              <div className='text-muted-foreground'>
                Account ID: {company.id}
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Contact Person</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {company.contactPerson}
              </CardTitle>
              <Badge variant='outline'>
                <IconUser className='h-3 w-3' />
                Primary Contact
              </Badge>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {company.email}
              </div>
              <div className='text-muted-foreground'>{company.phone}</div>
            </CardFooter>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Company Info</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {company.industry}
              </CardTitle>
              <Badge variant='outline'>
                <IconBuilding className='h-3 w-3' />
                Established {company.yearEstablished}
              </Badge>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Tax ID: {company.taxId}
              </div>
              <div className='text-muted-foreground'>{company.address}</div>
            </CardFooter>
          </Card>
        </div>

        {/* Profile Forms */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconBuilding className='h-5 w-5' />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Update your company details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(handleProfileSave)}
                    className='space-y-6'
                  >
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={profileForm.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter company name'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='contactPerson'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Contact</FormLabel>
                            <FormControl>
                              <Input placeholder='John Smith' {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type='email'
                                placeholder='finance@company.com'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='+1 (555) 123-4567'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='industry'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Technology, Healthcare, etc.'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='yearEstablished'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year Established</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='2020'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='taxId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID / EIN</FormLabel>
                            <FormControl>
                              <Input placeholder='12-3456789' {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='123 Business St, City, State ZIP'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className='flex justify-end gap-3 border-t pt-6'>
                      <Button
                        type='submit'
                        disabled={saving}
                        className='flex items-center gap-2'
                      >
                        <IconDeviceFloppy className='h-4 w-4' />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className='col-span-4 md:col-span-3'>
            <div className='space-y-4'>
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <IconBell className='h-5 w-5' />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...notificationForm}>
                    <form
                      onSubmit={notificationForm.handleSubmit(
                        handleNotificationSave
                      )}
                      className='space-y-4'
                    >
                      <FormField
                        control={notificationForm.control}
                        name='emailNotifications'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base'>
                                Email Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive updates via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name='smsNotifications'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base'>
                                SMS Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive updates via text message
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name='reportAlerts'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base'>
                                Report Alerts
                              </FormLabel>
                              <FormDescription>
                                Notify when new reports are ready
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name='taskUpdates'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base'>
                                Task Updates
                              </FormLabel>
                              <FormDescription>
                                Notify when task status changes
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name='messageAlerts'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base'>
                                Message Alerts
                              </FormLabel>
                              <FormDescription>
                                Notify when you receive new messages
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className='flex justify-end pt-4'>
                        <Button type='submit' disabled={saving} size='sm'>
                          {saving ? 'Saving...' : 'Save Preferences'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Security & Account */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <IconShield className='h-5 w-5' />
                    Security & Account
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full justify-start'
                    onClick={() =>
                      router.push('/dashboard/profile/change-password')
                    }
                  >
                    Change Password
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full justify-start'
                    onClick={() => router.push('/dashboard/profile/two-factor')}
                  >
                    Two-Factor Authentication
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full justify-start'
                    onClick={() => router.push('/dashboard/profile/sessions')}
                  >
                    Active Sessions
                  </Button>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <IconMail className='h-5 w-5' />
                    Support & Help
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full justify-start'
                    onClick={() => router.push('/dashboard/support')}
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full justify-start'
                    onClick={() => router.push('/dashboard/help')}
                  >
                    Help Center
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
