-- Check and Fix Tables - Only fix tables that exist
-- Run this in your Supabase SQL Editor

-- First, let's see what tables actually exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
ORDER BY table_name;

-- Check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'documents', 'tasks', 'messages', 'financial_records');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('companies', 'documents', 'tasks', 'messages', 'financial_records')
ORDER BY tablename, policyname; 