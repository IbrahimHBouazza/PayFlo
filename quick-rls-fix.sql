-- Quick RLS Fix for PGRST116 Error
-- Run this in your Supabase SQL Editor

-- Step 1: Disable RLS on companies table (temporary fix)
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Step 2: Test that it works
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Quick Test Company', 'quick-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Step 3: Verify the insert worked
SELECT * FROM companies WHERE email = 'quick-test@example.com';

-- Step 4: Clean up test data
DELETE FROM companies WHERE email = 'quick-test@example.com';

-- Step 5: Re-enable RLS with proper policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop any existing policies
DROP POLICY IF EXISTS "Allow all operations on companies" ON companies;
DROP POLICY IF EXISTS "Allow insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow select on companies" ON companies;
DROP POLICY IF EXISTS "Allow update on companies" ON companies;
DROP POLICY IF EXISTS "Allow delete on companies" ON companies;
DROP POLICY IF EXISTS "companies_insert_policy" ON companies;
DROP POLICY IF EXISTS "companies_select_policy" ON companies;
DROP POLICY IF EXISTS "companies_update_policy" ON companies;
DROP POLICY IF EXISTS "companies_delete_policy" ON companies;

-- Step 7: Create simple, permissive policies
CREATE POLICY "companies_all_policy" ON companies
  FOR ALL USING (true) WITH CHECK (true);

-- Step 8: Test the new policy
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Policy Test Company', 'policy-test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Step 9: Verify it works
SELECT * FROM companies WHERE email = 'policy-test@example.com';

-- Step 10: Clean up
DELETE FROM companies WHERE email = 'policy-test@example.com';

-- Step 11: Show final status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'companies';

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'companies'; 