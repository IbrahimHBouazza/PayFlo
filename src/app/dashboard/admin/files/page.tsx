'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  IconUpload,
  IconDownload,
  IconFile,
  IconTrash,
  IconBuilding,
  IconCalendar
} from '@tabler/icons-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type FileUploadFormValues = {
  clientId: string;
  fileName: string;
  fileType: string;
  description: string;
};

type FileRecord = {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  clientName: string;
  uploadedBy: string;
  description?: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
};

// Sample data
const sampleClients: Client[] = [
  { id: '1', name: 'Acme Corporation', email: 'finance@acme.com' },
  { id: '2', name: 'TechStart Solutions', email: 'accounting@techstart.com' },
  { id: '3', name: 'Green Earth Industries', email: 'finance@greenearth.com' },
  { id: '4', name: 'Global Trading Co', email: 'accounts@globaltrading.com' }
];

const sampleFiles: FileRecord[] = [
  {
    id: '1',
    name: 'acme-tax-return-2024.pdf',
    originalName: 'Tax Return 2024.pdf',
    mimeType: 'application/pdf',
    size: 2048576,
    url: '#',
    uploadedAt: '2024-01-15T10:30:00Z',
    clientName: 'Acme Corporation',
    uploadedBy: 'Admin User',
    description: 'Annual tax return for 2024'
  },
  {
    id: '2',
    name: 'techstart-financial-statement.pdf',
    originalName: 'Financial Statement Q4 2023.pdf',
    mimeType: 'application/pdf',
    size: 1536000,
    url: '#',
    uploadedAt: '2024-01-10T14:20:00Z',
    clientName: 'TechStart Solutions',
    uploadedBy: 'Admin User',
    description: 'Quarterly financial statement'
  },
  {
    id: '3',
    name: 'greenearth-invoice-batch.xlsx',
    originalName: 'Invoice Batch March 2024.xlsx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 512000,
    url: '#',
    uploadedAt: '2024-01-20T09:15:00Z',
    clientName: 'Green Earth Industries',
    uploadedBy: 'Admin User',
    description: 'Monthly invoice batch'
  }
];

export default function AdminFilesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>(sampleFiles);
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FileUploadFormValues>({
    defaultValues: { clientId: '', fileName: '', fileType: '', description: '' }
  });

  // Check if user is admin
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role as string;
      if (userRole !== 'ADMIN') {
        router.push('/dashboard/overview');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium'>Loading...</div>
            <div className='text-muted-foreground text-sm'>
              Checking permissions
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isLoaded && user && user.publicMetadata?.role !== 'ADMIN') {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg font-medium text-red-600'>
              Access Denied
            </div>
            <div className='text-muted-foreground text-sm'>
              You don't have permission to view this page
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
      return '📊';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    return '📁';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('fileName', file.name);
      form.setValue('fileType', file.type);
    }
  };

  const handleUploadFile = async (values: FileUploadFormValues) => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Simulate file upload
      const newFile: FileRecord = {
        id: Date.now().toString(),
        name: selectedFile.name,
        originalName: selectedFile.name,
        mimeType: selectedFile.type,
        size: selectedFile.size,
        url: '#',
        uploadedAt: new Date().toISOString(),
        clientName:
          clients.find((c) => c.id === values.clientId)?.name ||
          'Unknown Client',
        uploadedBy: user?.fullName || 'Admin User',
        description: values.description
      };

      setFiles((prev) => [newFile, ...prev]);
      setIsModalOpen(false);
      form.reset();
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = (file: FileRecord) => {
    // Simulate download
    console.log('Downloading:', file.name);
    // In real implementation, this would trigger actual file download
  };

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              File Management
            </h2>
            <p className='text-muted-foreground'>
              Upload and manage client documents and files
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className='flex items-center gap-2'
          >
            <IconUpload className='h-4 w-4' />
            Upload File
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Files</CardTitle>
              <IconFile className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{files.length}</div>
              <p className='text-muted-foreground text-xs'>
                Uploaded documents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Size</CardTitle>
              <IconFile className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatFileSize(
                  files.reduce((sum, file) => sum + file.size, 0)
                )}
              </div>
              <p className='text-muted-foreground text-xs'>Storage used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Clients
              </CardTitle>
              <IconBuilding className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {new Set(files.map((f) => f.clientName)).size}
              </div>
              <p className='text-muted-foreground text-xs'>With files</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>This Month</CardTitle>
              <IconCalendar className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {
                  files.filter((f) => {
                    const uploadDate = new Date(f.uploadedAt);
                    const now = new Date();
                    return (
                      uploadDate.getMonth() === now.getMonth() &&
                      uploadDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </div>
              <p className='text-muted-foreground text-xs'>Files uploaded</p>
            </CardContent>
          </Card>
        </div>

        {/* Files Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Files</CardTitle>
            <CardDescription>
              Manage uploaded documents and files for your clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-600'>
                {error}
              </div>
            )}
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='p-3 text-left font-medium'>File</th>
                    <th className='p-3 text-left font-medium'>Client</th>
                    <th className='p-3 text-left font-medium'>Size</th>
                    <th className='p-3 text-left font-medium'>Uploaded</th>
                    <th className='p-3 text-left font-medium'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className='text-muted-foreground p-6 text-center'
                      >
                        Loading files...
                      </td>
                    </tr>
                  ) : files.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className='text-muted-foreground p-6 text-center'
                      >
                        No files found.
                      </td>
                    </tr>
                  ) : (
                    files.map((file) => (
                      <tr key={file.id} className='hover:bg-muted/50 border-b'>
                        <td className='p-3'>
                          <div className='flex items-center gap-3'>
                            <span className='text-2xl'>
                              {getFileIcon(file.mimeType)}
                            </span>
                            <div>
                              <div className='font-medium'>
                                {file.originalName}
                              </div>
                              {file.description && (
                                <div className='text-muted-foreground text-sm'>
                                  {file.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='font-medium'>{file.clientName}</div>
                          <div className='text-muted-foreground text-sm'>
                            by {file.uploadedBy}
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='font-medium'>
                            {formatFileSize(file.size)}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            {file.mimeType}
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='font-medium'>
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </div>
                          <div className='text-muted-foreground text-sm'>
                            {new Date(file.uploadedAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className='p-3'>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDownload(file)}
                              className='flex items-center gap-1'
                            >
                              <IconDownload className='h-3 w-3' />
                              Download
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(file.id)}
                              className='flex items-center gap-1 text-red-600 hover:text-red-700'
                            >
                              <IconTrash className='h-3 w-3' />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Modal
          title='Upload File'
          description='Upload a new file for a client.'
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUploadFile)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='clientId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Choose a client' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='fileName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        onChange={handleFileSelect}
                        accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Brief description of the file'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFile(null);
                    form.reset();
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={submitting || !selectedFile}>
                  {submitting ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </form>
          </Form>
        </Modal>
      </div>
    </PageContainer>
  );
}
