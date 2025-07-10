export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
  contact_person: string;
  industry: string;
  year_established: number;
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
  file_size: number;
  uploaded_at: string;
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
}

export interface Task {
  id: string;
  company_id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'WAITING_ON_CLIENT' | 'COMPLETED';
  due_date: string;
  assigned_to: string;
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

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company;
        Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Company>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, 'id' | 'uploaded_at'> & {
          id?: string;
          uploaded_at?: string;
        };
        Update: Partial<Document>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Task>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Message>;
      };
      financial_records: {
        Row: FinancialRecord;
        Insert: Omit<FinancialRecord, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<FinancialRecord>;
      };
    };
  };
}
