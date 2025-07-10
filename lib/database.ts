import { createClient } from '@supabase/supabase-js';

// Fallback values to prevent app crashes during development
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

// Check if we're using placeholder values (including the actual placeholder text)
const isUsingPlaceholders =
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseAnonKey === 'placeholder_key' ||
  supabaseUrl === 'your_supabase_project_url' ||
  supabaseAnonKey === 'your_supabase_anon_key';

// Debug logging
console.log('=== SUPABASE CONFIG DEBUG ===');
console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseAnonKey exists:', !!supabaseAnonKey);
console.log('supabaseServiceKey exists:', !!supabaseServiceKey);
console.log(
  'supabaseServiceKey starts with eyJ:',
  supabaseServiceKey.startsWith('eyJ')
);
console.log(
  'supabaseServiceKey is placeholder:',
  supabaseServiceKey === 'placeholder_service_key'
);
console.log('supabase created:', !isUsingPlaceholders);
console.log(
  'supabaseAdmin created:',
  !isUsingPlaceholders && !!supabaseServiceKey
);

// Only create the Supabase client if we have valid credentials
export const supabase = isUsingPlaceholders
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for API routes) - uses service role key to bypass RLS
export const supabaseAdmin =
  isUsingPlaceholders ||
  !supabaseServiceKey ||
  supabaseServiceKey === 'placeholder_service_key' ||
  supabaseServiceKey === 'your_actual_service_role_key_here'
    ? null
    : createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  contact_person?: string;
  industry?: string;
  year_established?: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  company_id: string;
  name: string;
  type: string;
  file_url: string;
  file_size?: number;
  uploaded_at: string;
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
}

export interface Task {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'WAITING_ON_CLIENT' | 'COMPLETED';
  due_date: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  company_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  thread_id: string;
  is_read: boolean;
}

export interface FinancialRecord {
  id: string;
  company_id: string;
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  tax_liability: number;
  created_at: string;
}

// Company operations - Using only admin client to bypass RLS
export const companyService = {
  async getAll(): Promise<Company[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Company | null> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByEmail(email: string): Promise<Company | null> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data;
  },

  async create(
    company: Omit<Company, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Company> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

    // Clean the data to ensure no undefined values
    const cleanCompanyData: Record<string, any> = {
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      tax_id: company.tax_id,
      contact_person: company.contact_person,
      industry: company.industry,
      year_established: company.year_established,
      status: company.status || 'ACTIVE'
    };
    Object.keys(cleanCompanyData).forEach((key) => {
      if (cleanCompanyData[key] === undefined) {
        delete cleanCompanyData[key];
      }
    });

    console.log('Attempting to insert company:', cleanCompanyData);

    // Option 1: Insert without select first, then fetch separately to avoid RLS issues
    const { error: insertError } = await supabaseAdmin
      .from('companies')
      .insert([cleanCompanyData]);

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    // Fetch the inserted company separately
    const { data: fetchData, error: fetchError } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('email', company.email)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

    if (!fetchData) {
      console.error('Insert succeeded but no data returned');
      throw new Error('Insert succeeded but no data returned');
    }

    console.log('Successfully inserted company:', fetchData);
    return fetchData;
  },

  async update(id: string, updates: Partial<Company>): Promise<Company> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { error } = await supabaseAdmin
      .from('companies')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Document operations
export const documentService = {
  // Get all documents
  async getAll(): Promise<Document[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get documents by company
  async getByCompany(companyId: string): Promise<Document[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('company_id', companyId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get document by ID
  async getById(id: string): Promise<Document | null> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new document
  async create(
    document: Omit<Document, 'id' | 'uploaded_at'>
  ): Promise<Document> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update document status
  async updateStatus(
    id: string,
    status: Document['status']
  ): Promise<Document> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('documents')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete document
  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { error } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Task operations
export const taskService = {
  // Get all tasks
  async getAll(): Promise<Task[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get tasks by company
  async getByCompany(companyId: string): Promise<Task[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('company_id', companyId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get task by ID
  async getById(id: string): Promise<Task | null> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new task
  async create(
    task: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Task> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update task
  async update(id: string, updates: Partial<Task>): Promise<Task> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete task
  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { error } = await supabaseAdmin.from('tasks').delete().eq('id', id);

    if (error) throw error;
  },

  // Get tasks by status
  async getByStatus(
    companyId: string,
    status: Task['status']
  ): Promise<Task[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', status)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// Message operations
export const messageService = {
  // Get messages by company
  async getByCompany(companyId: string): Promise<Message[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get messages by thread
  async getByThread(companyId: string, threadId: string): Promise<Message[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('company_id', companyId)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create new message
  async create(message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark message as read
  async markAsRead(id: string): Promise<Message> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get unread message count
  async getUnreadCount(companyId: string): Promise<number> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { count, error } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
};

// Financial record operations
export const financialService = {
  // Get all financial records
  async getAll(): Promise<FinancialRecord[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('financial_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get financial records by company
  async getByCompany(companyId: string): Promise<FinancialRecord[]> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('financial_records')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get financial record by ID
  async getById(id: string): Promise<FinancialRecord | null> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('financial_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new financial record
  async create(
    record: Omit<FinancialRecord, 'id' | 'created_at'>
  ): Promise<FinancialRecord> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('financial_records')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update financial record
  async update(
    id: string,
    updates: Partial<FinancialRecord>
  ): Promise<FinancialRecord> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('financial_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get financial summary for a company
  async getSummary(companyId: string): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
    totalTaxLiability: number;
    recordCount: number;
  }> {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
    const { data, error } = await supabaseAdmin
      .from('financial_records')
      .select('revenue, expenses, profit, tax_liability')
      .eq('company_id', companyId);

    if (error) throw error;

    const summary = data?.reduce(
      (acc, record) => ({
        totalRevenue: acc.totalRevenue + (record.revenue || 0),
        totalExpenses: acc.totalExpenses + (record.expenses || 0),
        totalProfit: acc.totalProfit + (record.profit || 0),
        totalTaxLiability: acc.totalTaxLiability + (record.tax_liability || 0),
        recordCount: acc.recordCount + 1
      }),
      {
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        totalTaxLiability: 0,
        recordCount: 0
      }
    );

    return (
      summary || {
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        totalTaxLiability: 0,
        recordCount: 0
      }
    );
  }
};
