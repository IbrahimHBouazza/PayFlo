# Supabase Setup Guide for Client Portal

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a project name (e.g., "payflo-client-portal")
4. Set a database password
5. Choose a region close to your users

### 2. Get Your Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Update Environment Variables

1. Open `.env.local` in your project
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables and sample data

### 5. Configure Storage (for Document Uploads)

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `documents`
3. Set the bucket to public (for now - you can secure it later)
4. Update the storage policies if needed

### 6. Test the Connection

1. Start your development server: `npm run dev`
2. Check the browser console for any connection errors
3. The app should now be connected to Supabase!

## 📊 Database Schema Overview

### Tables Created:

- **`companies`** - Client company information
- **`documents`** - Uploaded files and reports
- **`tasks`** - Accounting tasks and their status
- **`messages`** - Communication between clients and accountants
- **`financial_records`** - Financial data and reports

### Sample Data Included:

- 3 sample companies (Acme Corp, TechStart, Green Earth)
- Sample tasks for each company
- Sample financial records

## 🔐 Security & Row Level Security (RLS)

The schema includes basic RLS policies. For production, you should:

1. **Customize RLS policies** based on user roles
2. **Add authentication integration** (Supabase Auth or Clerk)
3. **Secure file uploads** with proper access controls
4. **Add rate limiting** for API calls

## 🛠️ Next Steps

### Replace Mock Data

1. Update components to use real database queries
2. Replace static data with `companyService`, `taskService`, etc.
3. Add error handling for database operations

### Add Real-time Features

```typescript
// Subscribe to real-time updates
const subscription = supabase
  .channel('tasks')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### File Upload Integration

```typescript
// Upload file to Supabase Storage
const { data, error } = await supabase.storage
  .from('documents')
  .upload('path/to/file.pdf', file)
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid API key"** - Check your environment variables
2. **"Table doesn't exist"** - Run the SQL schema script
3. **"RLS policy violation"** - Check your RLS policies
4. **"CORS error"** - Add your domain to Supabase allowed origins

### Debug Mode:

Add this to see detailed Supabase logs:

```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true
  }
})
```

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage API](https://supabase.com/docs/guides/storage)

## 🔄 Migration from Mock Data

To migrate from mock data to real Supabase data:

1. **Update API calls** in components
2. **Add loading states** for database operations
3. **Implement error handling**
4. **Add optimistic updates** for better UX
5. **Test all CRUD operations**

Example migration:

```typescript
// Before (mock data)
const companies = sampleCompanies

// After (Supabase)
const { data: companies, error } = await companyService.getCompanies()
if (error) {
  console.error('Error fetching companies:', error)
  return []
}
``` 