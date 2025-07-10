import { createClient } from '@supabase/supabase-js';

// Fallback values to prevent app crashes during development
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

// Debug logging
console.log('=== SUPABASE CONFIG DEBUG ===');
console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseAnonKey exists:', !!supabaseAnonKey);
console.log('supabaseServiceKey exists:', !!supabaseServiceKey);
console.log(
  'supabaseServiceKey starts with eyJ:',
  supabaseServiceKey?.startsWith('eyJ')
);
console.log(
  'supabaseServiceKey is placeholder:',
  supabaseServiceKey === 'placeholder_service_key' ||
    supabaseServiceKey === 'your_actual_service_role_key_here'
);

// Check if we're using placeholder values (including the actual placeholder text)
const isUsingPlaceholders =
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseAnonKey === 'placeholder_key' ||
  supabaseUrl === 'your_supabase_project_url' ||
  supabaseAnonKey === 'your_supabase_anon_key';

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

console.log('supabase created:', !!supabase);
console.log('supabaseAdmin created:', !!supabaseAdmin);

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !isUsingPlaceholders;
