-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create companies table
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

-- Create documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSED', 'REJECTED'))
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'WAITING_ON_CLIENT', 'COMPLETED')),
  due_date DATE NOT NULL,
  assigned_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sender_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  thread_id VARCHAR(255) DEFAULT 'default',
  is_read BOOLEAN DEFAULT FALSE
);

-- Create financial_records table
CREATE TABLE financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL, -- e.g., '2024-Q1', '2024-01'
  revenue DECIMAL(15,2) DEFAULT 0,
  expenses DECIMAL(15,2) DEFAULT 0,
  profit DECIMAL(15,2) DEFAULT 0,
  tax_liability DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_messages_company_id ON messages(company_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_financial_records_company_id ON financial_records(company_id);
CREATE INDEX idx_financial_records_period ON financial_records(period);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Create more explicit RLS policies for companies
-- Drop existing policies first
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

-- Create RLS policies for other tables (basic example - you'll need to customize based on your auth setup)
-- For now, we'll allow all operations (you should restrict this based on user roles)

-- Documents policy
DROP POLICY IF EXISTS "Allow all operations on documents" ON documents;
CREATE POLICY "Allow all operations on documents" ON documents
  FOR ALL USING (true);

-- Tasks policy
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
CREATE POLICY "Allow all operations on tasks" ON tasks
  FOR ALL USING (true);

-- Messages policy
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL USING (true);

-- Financial records policy
DROP POLICY IF EXISTS "Allow all operations on financial_records" ON financial_records;
CREATE POLICY "Allow all operations on financial_records" ON financial_records
  FOR ALL USING (true);

-- Insert sample data
INSERT INTO companies (name, email, phone, address, tax_id, contact_person, industry, year_established) VALUES
('Acme Corporation', 'finance@acme.com', '+1 (555) 123-4567', '123 Business Ave, New York, NY 10001', '12-3456789', 'John Smith', 'Technology', 2018),
('TechStart Solutions', 'accounting@techstart.com', '+1 (555) 987-6543', '456 Innovation Dr, San Francisco, CA 94102', '98-7654321', 'Sarah Johnson', 'Technology', 2020),
('Green Earth Industries', 'finance@greenearth.com', '+1 (555) 456-7890', '789 Eco Way, Portland, OR 97201', '45-6789012', 'Mike Wilson', 'Manufacturing', 2015);

-- Insert sample tasks
INSERT INTO tasks (company_id, title, description, status, due_date, assigned_to) VALUES
((SELECT id FROM companies WHERE name = 'Acme Corporation'), 'Q4 2024 VAT Return', 'Complete VAT return for Q4 2024', 'IN_PROGRESS', '2024-01-31', 'Accountant'),
((SELECT id FROM companies WHERE name = 'Acme Corporation'), 'Annual Tax Filing', 'Prepare and file annual tax return', 'TODO', '2024-03-15', 'Accountant'),
((SELECT id FROM companies WHERE name = 'TechStart Solutions'), 'Year End Accounts', 'Prepare year end financial statements', 'WAITING_ON_CLIENT', '2024-02-28', 'Client');

-- Insert sample financial records
INSERT INTO financial_records (company_id, period, revenue, expenses, profit, tax_liability) VALUES
((SELECT id FROM companies WHERE name = 'Acme Corporation'), '2024-Q4', 156000, 67500, 88500, 23500),
((SELECT id FROM companies WHERE name = 'Acme Corporation'), '2024-Q3', 142000, 63000, 79000, 21000),
((SELECT id FROM companies WHERE name = 'TechStart Solutions'), '2024-Q4', 89000, 45000, 44000, 12000); 