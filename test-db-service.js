// Simple test script to verify database service functionality
const fetch = require('node-fetch');

async function testDatabaseService() {
  console.log('Testing database service...\n');

  try {
    // Test 1: Get all clients
    console.log('1. Testing GET /api/admin/clients...');
    const clientsResponse = await fetch(
      'http://localhost:3000/api/admin/clients'
    );
    const clientsData = await clientsResponse.json();
    console.log('Status:', clientsResponse.status);
    console.log('Response:', JSON.stringify(clientsData, null, 2));
    console.log('');

    // Test 2: Get clients count
    console.log('2. Testing GET /api/admin/clients/count...');
    const countResponse = await fetch(
      'http://localhost:3000/api/admin/clients/count'
    );
    const countData = await countResponse.json();
    console.log('Status:', countResponse.status);
    console.log('Response:', JSON.stringify(countData, null, 2));
    console.log('');

    // Test 3: Get documents count
    console.log('3. Testing GET /api/admin/documents/count...');
    const docsResponse = await fetch(
      'http://localhost:3000/api/admin/documents/count'
    );
    const docsData = await docsResponse.json();
    console.log('Status:', docsResponse.status);
    console.log('Response:', JSON.stringify(docsData, null, 2));
    console.log('');

    // Test 4: Get pending tasks count
    console.log('4. Testing GET /api/admin/tasks/pending...');
    const tasksResponse = await fetch(
      'http://localhost:3000/api/admin/tasks/pending'
    );
    const tasksData = await tasksResponse.json();
    console.log('Status:', tasksResponse.status);
    console.log('Response:', JSON.stringify(tasksData, null, 2));
    console.log('');

    // Test 5: Get total revenue
    console.log('5. Testing GET /api/admin/financial/revenue...');
    const revenueResponse = await fetch(
      'http://localhost:3000/api/admin/financial/revenue'
    );
    const revenueData = await revenueResponse.json();
    console.log('Status:', revenueResponse.status);
    console.log('Response:', JSON.stringify(revenueData, null, 2));
    console.log('');

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDatabaseService();
