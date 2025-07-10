// Test script to verify the company creation fix
const testCompanyCreation = async () => {
  try {
    console.log('🧪 Testing company creation with logo_url field...\n');

    const testData = {
      name: 'Test Company with Logo',
      email: 'test' + Date.now() + '@example.com',
      phone: '+1-555-0123',
      address: '123 Test St, Test City, TC 12345',
      tax_id: '12-3456789',
      contact_person: 'Test Contact',
      industry: 'Technology',
      year_established: 2020,
      status: 'ACTIVE',
      logo_url: 'https://example.com/logo.png' // This should be filtered out
    };

    console.log('Sending data with logo_url:', testData);

    const response = await fetch('http://localhost:3000/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Company created successfully!');
      console.log('Response:', result);

      // Verify that logo_url was not saved to the database
      if (result.logo_url) {
        console.log(
          '⚠️  Warning: logo_url was saved to database (this might be expected if you added the field)'
        );
      } else {
        console.log('✅ logo_url was correctly filtered out');
      }
    } else {
      console.error('❌ Error creating company:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testCompanyCreation();
