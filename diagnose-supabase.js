// Diagnostic script to identify Supabase issues
// Run with: node diagnose-supabase.js

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Diagnostic Tool');
console.log('==========================');

// Check environment variables
console.log('\n1. Environment Variables:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log(
    '\n❌ Environment variables are missing. Please check your .env.local file.'
  );
  process.exit(1);
}

// Create client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runDiagnostics() {
  try {
    // Test 1: Basic connection
    console.log('\n2. Testing Basic Connection:');
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Connection failed:', testError.message);
      return;
    }
    console.log('✅ Connection successful');

    // Test 2: Check table structure
    console.log('\n3. Checking Table Structure:');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1);

    if (companiesError) {
      console.log('❌ Table access failed:', companiesError.message);
    } else {
      console.log('✅ Table access successful');
      if (companies && companies.length > 0) {
        console.log('📋 Sample company columns:', Object.keys(companies[0]));
      }
    }

    // Test 3: Test RLS policies
    console.log('\n4. Testing RLS Policies:');

    // Test select
    const { data: selectData, error: selectError } = await supabase
      .from('companies')
      .select('id, name, email')
      .limit(1);

    if (selectError) {
      console.log('❌ SELECT policy failed:', selectError.message);
    } else {
      console.log('✅ SELECT policy working');
    }

    // Test 5: Test insert (this is where PGRST116 usually occurs)
    console.log('\n5. Testing Insert Operation:');

    const testCompany = {
      name: 'Diagnostic Test Company',
      email: `test-${Date.now()}@diagnostic.com`,
      phone: '+1-555-0123',
      status: 'ACTIVE'
    };

    console.log('Attempting insert with data:', testCompany);

    // Method 1: Standard insert with select
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('companies')
        .insert(testCompany)
        .select()
        .single();

      if (insertError) {
        console.log('❌ Standard insert failed:', insertError.message);
        console.log('Error code:', insertError.code);

        if (insertError.code === 'PGRST116') {
          console.log('🔍 PGRST116 detected - this is the issue!');
        }
      } else {
        console.log('✅ Standard insert successful:', insertData);

        // Clean up
        await supabase
          .from('companies')
          .delete()
          .eq('email', testCompany.email);
        console.log('🧹 Test data cleaned up');
        return;
      }
    } catch (error) {
      console.log('❌ Standard insert threw exception:', error.message);
    }

    // Method 2: Insert without select
    console.log('\n6. Testing Insert Without Select:');
    try {
      const { error: insertOnlyError } = await supabase
        .from('companies')
        .insert(testCompany);

      if (insertOnlyError) {
        console.log(
          '❌ Insert without select failed:',
          insertOnlyError.message
        );
      } else {
        console.log('✅ Insert without select successful');

        // Try to fetch the inserted data
        const { data: fetchData, error: fetchError } = await supabase
          .from('companies')
          .select('*')
          .eq('email', testCompany.email)
          .single();

        if (fetchError) {
          console.log('❌ Fetch after insert failed:', fetchError.message);
        } else {
          console.log('✅ Fetch after insert successful:', fetchData);

          // Clean up
          await supabase
            .from('companies')
            .delete()
            .eq('email', testCompany.email);
          console.log('🧹 Test data cleaned up');
        }
      }
    } catch (error) {
      console.log('❌ Insert without select threw exception:', error.message);
    }

    // Test 7: Check RLS status
    console.log('\n7. RLS Status Check:');
    console.log(
      '💡 If all tests above failed, try running the disable-rls-temporarily.sql script'
    );
    console.log('💡 This will help determine if RLS is the root cause');
  } catch (error) {
    console.log('❌ Diagnostic failed:', error.message);
  }
}

runDiagnostics().then(() => {
  console.log('\n🏁 Diagnostic complete');
  console.log('\n📋 Next Steps:');
  console.log('1. If PGRST116 appears, run disable-rls-temporarily.sql');
  console.log('2. If that fixes it, the issue is with RLS policies');
  console.log('3. If it still fails, check your Supabase project settings');
});
