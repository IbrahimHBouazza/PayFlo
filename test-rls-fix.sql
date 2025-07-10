-- Temporary fix: Disable RLS on companies table for testing
-- Run this in your Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Test insert
INSERT INTO companies (name, email, phone) VALUES ('Test RLS Disabled', 'test-rls@example.com', '+1-555-0123');

-- Check if it worked
SELECT * FROM companies WHERE email = 'test-rls@example.com';

-- Re-enable RLS after testing (uncomment when done)
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY; 