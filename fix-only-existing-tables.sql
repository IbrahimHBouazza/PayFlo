-- Fix RLS for Only Existing Tables
-- Run this in your Supabase SQL Editor

-- Step 1: Check what tables actually exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
ORDER BY table_name;

-- Step 2: Disable RLS only on tables that exist
-- Companies table (we know this exists)
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Try to disable RLS on other tables (will only work if they exist)
DO $$
BEGIN
    -- Try documents table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documents') THEN
        ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on documents table';
    END IF;
    
    -- Try tasks table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks') THEN
        ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on tasks table';
    END IF;
    
    -- Try financial_records table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'financial_records') THEN
        ALTER TABLE financial_records DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on financial_records table';
    END IF;
    
    -- Skip messages table since it doesn't exist
    RAISE NOTICE 'Skipping messages table (does not exist)';
END $$;

-- Step 3: Drop all existing policies on companies table
DROP POLICY IF EXISTS "Allow all operations on companies" ON companies;
DROP POLICY IF EXISTS "Allow insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow select on companies" ON companies;
DROP POLICY IF EXISTS "Allow update on companies" ON companies;
DROP POLICY IF EXISTS "Allow delete on companies" ON companies;
DROP POLICY IF EXISTS "companies_insert_policy" ON companies;
DROP POLICY IF EXISTS "companies_select_policy" ON companies;
DROP POLICY IF EXISTS "companies_update_policy" ON companies;
DROP POLICY IF EXISTS "companies_delete_policy" ON companies;
DROP POLICY IF EXISTS "companies_all_policy" ON companies;

-- Step 4: Test that it works
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('RLS Disabled Test Company', 'rls-disabled-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Step 5: Verify the insert worked
SELECT * FROM companies WHERE email = 'rls-disabled-test@example.com';

-- Step 6: Clean up test data
DELETE FROM companies WHERE email = 'rls-disabled-test@example.com';

-- Step 7: Show final status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'documents', 'tasks', 'financial_records')
ORDER BY tablename; 