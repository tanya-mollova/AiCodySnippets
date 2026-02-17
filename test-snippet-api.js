// Quick test script to check the snippet creation API
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

// Test snippet creation
async function testCreateSnippet() {
  // First, login to get a token
  console.log('Step 1: Logging in...');
  try {
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',  // Replace with your test user
        password: 'test123',  // Replace with your test password
      }),
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('Login failed:', loginData);
      console.log('\nPlease update the email/password in test-snippet-api.js with your actual credentials');
      return;
    }

    console.log('✓ Login successful');
    const token = loginData.token;

    // Now try to create a snippet
    console.log('\nStep 2: Creating snippet...');
    const snippetData = {
      title: 'Test Snippet',
      description: 'This is a test snippet',
      code: 'console.log("Hello World");',
      language: 'javascript',
      tags: ['test', 'demo'],
      isPublic: false,
    };

    console.log('Snippet data:', JSON.stringify(snippetData, null, 2));
    console.log('Token:', token.substring(0, 20) + '...');

    const createResponse = await fetch(`${API_URL}/snippets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(snippetData),
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      console.error('\n❌ Snippet creation failed!');
      console.error('Status:', createResponse.status, createResponse.statusText);
      console.error('Error:', createData);
    } else {
      console.log('\n✓ Snippet created successfully!');
      console.log('Created snippet:', createData);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testCreateSnippet();
