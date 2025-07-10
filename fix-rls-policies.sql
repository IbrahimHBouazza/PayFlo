-- Fix RLS Policies for Companies Table
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on companies" ON companies;
DROP POLICY IF EXISTS "Allow insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow select on companies" ON companies;
DROP POLICY IF EXISTS "Allow update on companies" ON companies;
DROP POLICY IF EXISTS "Allow delete on companies" ON companies;

-- Create separate policies for different operations
CREATE POLICY "Allow insert on companies" ON companies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select on companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Allow update on companies" ON companies
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete on companies" ON companies
  FOR DELETE USING (true);

-- Test the policies by trying to insert and select
-- This will help verify the policies are working correctly
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established, status) 
VALUES ('Test Company', 'test@example.com', '+1-555-0123', '123 Test St', '12-3456789', 'Test Contact', 'Technology', 2020, 'ACTIVE');

-- Verify the insert worked
SELECT * FROM companies WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM companies WHERE email = 'test@example.com'; 