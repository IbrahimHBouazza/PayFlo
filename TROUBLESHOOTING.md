# Troubleshooting Guide

## PGRST116 Error: "JSON object requested, multiple (or no) rows returned"

### What This Error Means
This error occurs when Supabase's `.insert().select().single()` or `.maybeSingle()` doesn't return exactly one row. This typically happens due to:

1. **RLS (Row Level Security) policies** preventing the row from being returned after insert
2. **Database configuration issues** with UUID generation
3. **Transaction isolation** problems

### 🚨 IMMEDIATE SOLUTION (Try This First)

If you're still getting PGRST116 errors after the previous fixes, run this in your **Supabase SQL Editor**:

```sql
-- TEMPORARY FIX: Disable RLS for testing
-- WARNING: Only use this for development/testing, never in production!

ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records DISABLE ROW LEVEL SECURITY;
```

**Then test your company creation again.** If this fixes it, the issue is definitely with RLS policies.

### 🔍 Diagnostic Steps

#### Step 1: Run the Diagnostic Script

```bash
node diagnose-supabase.js
```

This will:
- Check your environment variables
- Test basic connection
- Test table access
- Test RLS policies
- Test insert operations
- Identify exactly where the PGRST116 occurs

#### Step 2: Check Your Supabase Project

1. **Go to your Supabase Dashboard**
2. **Check if your project is active** (not paused)
3. **Verify your API keys** in Settings → API
4. **Check the logs** in the Logs section for any errors

#### Step 3: Test Direct Database Operations

Run this in your Supabase SQL Editor:

```sql
-- Test insert and select
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Test Company', 'test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Verify the insert worked
SELECT * FROM companies WHERE email = 'test@example.com';

-- Clean up
DELETE FROM companies WHERE email = 'test@example.com';
```

### Step-by-Step Fix (If RLS is the issue)

#### 1. Fix RLS Policies (Most Common Cause)

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on companies" ON companies;

-- Create separate policies for different operations
CREATE POLICY "Allow insert on companies" ON companies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select on companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Allow update on companies" ON companies
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete on companies" ON companies
  FOR DELETE USING (true);
```

#### 2. Verify Your Table Schema

Make sure your `companies` table has the correct structure:

```sql
-- Check your table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;
```

The `id` column should be:
- `UUID` type
- `PRIMARY KEY`
- `DEFAULT gen_random_uuid()`

#### 3. Check Environment Variables

Verify your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

#### 4. Test the API Endpoint

Use the test script:

```bash
node test-company-creation.js
```

Or test manually with curl:

```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "email": "test@example.com",
    "phone": "+1-555-0123",
    "address": "123 Test St",
    "tax_id": "12-3456789",
    "contact_person": "Test Contact",
    "industry": "Technology",
    "year_established": 2020,
    "status": "ACTIVE"
  }'
```

### Alternative Solutions

#### Option 1: Disable RLS Temporarily (Development Only)

```sql
-- Only for development/testing
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
```

#### Option 2: Use Service Role Key

If the issue persists, you might need to use the service role key for admin operations:

1. Get your service role key from Supabase Dashboard → Settings → API
2. Create a separate Supabase client with the service role key
3. Use it only for admin operations

#### Option 3: Recreate the Table

If all else fails, you can recreate the table:

```sql
-- Drop and recreate the companies table
DROP TABLE IF EXISTS companies CASCADE;

CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  tax_id VARCHAR(50),
  contact_person VARCHAR(255),
  industry VARCHAR(100),
  year_established INTEGER,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Don't enable RLS initially for testing
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
```

### Debugging Steps

1. **Run the diagnostic script** to identify the exact issue
2. **Check the browser console** for detailed error messages
3. **Check the server logs** for the detailed error information
4. **Verify Supabase connection** by testing a simple select query
5. **Test with minimal data** (just name and email) to isolate the issue

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| RLS policies too restrictive | Disable RLS temporarily or use separate policies |
| UUID generation failing | Ensure `gen_random_uuid()` is available |
| Environment variables wrong | Check `.env.local` file |
| Supabase client not configured | Verify `lib/supabase.ts` setup |
| Project paused or inactive | Check Supabase dashboard |

### Still Having Issues?

If the problem persists after trying all the above:

1. **Run the diagnostic script** to get detailed information
2. **Check Supabase logs** in the dashboard
3. **Verify your Supabase project** is active and not paused
4. **Test with a fresh table** to rule out data corruption
5. **Contact Supabase support** if it's a platform issue

### Quick Test Commands

```bash
# Run diagnostic
node diagnose-supabase.js

# Test the API
curl -X GET http://localhost:3000/api/companies

# Test company creation
node test-company-creation.js

# Check if Supabase is configured
echo $NEXT_PUBLIC_SUPABASE_URL
```

### 🎯 Most Likely Solution

Based on the PGRST116 error pattern, the most likely solution is:

1. **Disable RLS temporarily** (see immediate solution above)
2. **Test company creation** - if it works, RLS is the issue
3. **Fix RLS policies** using the separate policy approach
4. **Re-enable RLS** once policies are fixed 