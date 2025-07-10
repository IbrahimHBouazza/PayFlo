-- Comprehensive RLS Fix for PayFlo App
-- Run this in your Supabase SQL Editor

-- First, let's check what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('companies', 'documents', 'tasks', 'messages', 'financial_records');

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow all operations on companies" ON companies;
DROP POLICY IF EXISTS "Allow insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow select on companies" ON companies;
DROP POLICY IF EXISTS "Allow update on companies" ON companies;
DROP POLICY IF EXISTS "Allow delete on companies" ON companies;

DROP POLICY IF EXISTS "Allow all operations on documents" ON documents;
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
DROP POLICY IF EXISTS "Allow all operations on financial_records" ON financial_records;

-- Temporarily disable RLS to test if that's the issue
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records DISABLE ROW LEVEL SECURITY;

-- Test insert and select to verify the fix
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('RLS Test Company', 'rls-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Verify the insert worked and can be retrieved
SELECT * FROM companies WHERE email = 'rls-test@example.com';

-- Clean up test data
DELETE FROM companies WHERE email = 'rls-test@example.com';

-- Now re-enable RLS with proper policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies that allow all operations
-- These policies are permissive and allow all operations (suitable for development)

-- Companies table policies
CREATE POLICY "companies_insert_policy" ON companies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "companies_select_policy" ON companies
  FOR SELECT USING (true);

CREATE POLICY "companies_update_policy" ON companies
  FOR UPDATE USING (true);

CREATE POLICY "companies_delete_policy" ON companies
  FOR DELETE USING (true);

-- Documents table policies
CREATE POLICY "documents_insert_policy" ON documents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "documents_select_policy" ON documents
  FOR SELECT USING (true);

CREATE POLICY "documents_update_policy" ON documents
  FOR UPDATE USING (true);

CREATE POLICY "documents_delete_policy" ON documents
  FOR DELETE USING (true);

-- Tasks table policies
CREATE POLICY "tasks_insert_policy" ON tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "tasks_select_policy" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "tasks_update_policy" ON tasks
  FOR UPDATE USING (true);

CREATE POLICY "tasks_delete_policy" ON tasks
  FOR DELETE USING (true);

-- Messages table policies
CREATE POLICY "messages_insert_policy" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_select_policy" ON messages
  FOR SELECT USING (true);

CREATE POLICY "messages_update_policy" ON messages
  FOR UPDATE USING (true);

CREATE POLICY "messages_delete_policy" ON messages
  FOR DELETE USING (true);

-- Financial records table policies
CREATE POLICY "financial_records_insert_policy" ON financial_records
  FOR INSERT WITH CHECK (true);

CREATE POLICY "financial_records_select_policy" ON financial_records
  FOR SELECT USING (true);

CREATE POLICY "financial_records_update_policy" ON financial_records
  FOR UPDATE USING (true);

CREATE POLICY "financial_records_delete_policy" ON financial_records
  FOR DELETE USING (true);

-- Test the new policies
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Policy Test Company', 'policy-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Verify the insert worked with new policies
SELECT * FROM companies WHERE email = 'policy-test@example.com';

-- Clean up test data
DELETE FROM companies WHERE email = 'policy-test@example.com';

-- Show the final policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
ORDER BY tablename, policyname; 