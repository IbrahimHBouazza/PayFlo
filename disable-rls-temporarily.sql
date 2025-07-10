-- TEMPORARY FIX: Disable RLS for testing
-- WARNING: Only use this for development/testing, never in production!

-- Disable RLS on all tables
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records DISABLE ROW LEVEL SECURITY;

-- Test insert and select
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Test Company RLS Disabled', 'test-rls-disabled@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Verify the insert worked
SELECT * FROM companies WHERE email = 'test-rls-disabled@example.com';

-- Clean up test data
DELETE FROM companies WHERE email = 'test-rls-disabled@example.com';

-- Re-enable RLS (uncomment when you want to re-enable)
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY; 