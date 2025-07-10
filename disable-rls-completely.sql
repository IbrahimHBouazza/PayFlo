-- Disable RLS Completely - No Security Policies Needed
-- Run this in your Supabase SQL Editor

-- Disable RLS on all tables
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (clean slate)
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

-- Test that it works
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('No RLS Test Company', 'no-rls-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Verify the insert worked
SELECT * FROM companies WHERE email = 'no-rls-test@example.com';

-- Clean up test data
DELETE FROM companies WHERE email = 'no-rls-test@example.com';

-- Show final status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'documents', 'tasks', 'messages', 'financial_records');