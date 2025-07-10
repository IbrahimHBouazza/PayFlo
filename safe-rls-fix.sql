-- Safe RLS Fix - Only for existing tables
-- Run this in your Supabase SQL Editor

-- Step 1: Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
ORDER BY table_name;

-- Step 2: Temporarily disable RLS on existing tables only
-- (This will only affect tables that exist)
DO $$
DECLARE
    tbl_name text;
BEGIN
    FOR tbl_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
    LOOP
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', tbl_name);
        RAISE NOTICE 'Disabled RLS on table: %', tbl_name;
    END LOOP;
END $$;

-- Step 3: Test insert on companies table (which we know exists)
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Safe RLS Test Company', 'safe-rls-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Step 4: Verify the insert worked
SELECT * FROM companies WHERE email = 'safe-rls-test@example.com';

-- Step 5: Clean up test data
DELETE FROM companies WHERE email = 'safe-rls-test@example.com';

-- Step 6: Re-enable RLS on existing tables
DO $$
DECLARE
    tbl_name text;
BEGIN
    FOR tbl_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl_name);
        RAISE NOTICE 'Enabled RLS on table: %', tbl_name;
    END LOOP;
END $$;

-- Step 7: Create policies only for existing tables
-- Companies table policies (we know this exists)
DROP POLICY IF EXISTS "Allow all operations on companies" ON companies;
DROP POLICY IF EXISTS "Allow insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow select on companies" ON companies;
DROP POLICY IF EXISTS "Allow update on companies" ON companies;
DROP POLICY IF EXISTS "Allow delete on companies" ON companies;

CREATE POLICY "companies_insert_policy" ON companies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "companies_select_policy" ON companies
  FOR SELECT USING (true);

CREATE POLICY "companies_update_policy" ON companies
  FOR UPDATE USING (true);

CREATE POLICY "companies_delete_policy" ON companies
  FOR DELETE USING (true);

-- Step 8: Test the new policies
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Policy Test Company', 'policy-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Verify the insert worked with new policies
SELECT * FROM companies WHERE email = 'policy-test@example.com';

-- Clean up test data
DELETE FROM companies WHERE email = 'policy-test@example.com';

-- Step 9: Show final status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'documents', 'tasks', 'messages', 'financial_records');

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
ORDER BY tablename, policyname; 