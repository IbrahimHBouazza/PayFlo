// Test script to debug the API endpoint
const testApiWithLogging = async () => {
  try {
    console.log('🧪 Testing API with detailed request...\n');

    const testData = {
      name: 'API Debug Test',
      email: 'apidebug' + Date.now() + '@example.com',
      phone: '+1-555-0123',
      address: '123 Test St, Test City, TC 12345',
      tax_id: '12-3456789',
      contact_person: 'Test Contact',
      industry: 'Technology',
      year_established: 2020,
      status: 'ACTIVE'
    };

    console.log(
      'Sending request to API with data:',
      JSON.stringify(testData, null, 2)
    );

    const response = await fetch('http://localhost:3000/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ API call successful!');
    } else {
      console.log('❌ API call failed');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testApiWithLogging();
