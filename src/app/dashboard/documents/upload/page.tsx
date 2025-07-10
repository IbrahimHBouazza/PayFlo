'use client';
import { useState } from 'react';

export default function DocumentUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    if (!file) {
      setMessage('Please select a file.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('type', type);
    formData.append('status', status);

    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData
    });

    setLoading(false);
    if (res.ok) {
      setMessage('Document uploaded successfully!');
      setFile(null);
      setName('');
      setType('');
      setStatus('PENDING');
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || 'Failed to upload document.');
    }
  }

  return (
    <div className='mx-auto max-w-lg p-8'>
      <h1 className='mb-6 text-2xl font-bold'>Upload Document</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='file'
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className='block w-full'
        />
        <input
          type='text'
          placeholder='Document Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='block w-full rounded border px-2 py-1'
          required
        />
        <input
          type='text'
          placeholder='Type (e.g. tax_return, invoice)'
          value={type}
          onChange={(e) => setType(e.target.value)}
          className='block w-full rounded border px-2 py-1'
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='block w-full rounded border px-2 py-1'
        >
          <option value='PENDING'>PENDING</option>
          <option value='PROCESSED'>PROCESSED</option>
          <option value='REJECTED'>REJECTED</option>
        </select>
        <button
          type='submit'
          className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <div className='mt-4 text-center'>{message}</div>}
    </div>
  );
}
