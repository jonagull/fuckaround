// Test script for refresh token functionality

async function testRefreshToken() {
  const API_URL = 'http://localhost:5155/api/v1';
  
  console.log('1. Testing login to get initial tokens...');
  
  // First, login to get tokens
  const loginResponse = await fetch(`${API_URL}/auth/web/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    }),
    credentials: 'include'
  });

  if (!loginResponse.ok) {
    console.error('Login failed:', loginResponse.status);
    const error = await loginResponse.text();
    console.error(error);
    return;
  }

  const loginData = await loginResponse.json();
  console.log('Login successful, got access token:', loginData.accessToken ? 'Yes' : 'No');
  
  // Get the cookies from the response
  const cookies = loginResponse.headers.get('set-cookie');
  console.log('Cookies received:', cookies ? 'Yes' : 'No');
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n2. Testing refresh token endpoint...');
  
  // Now test the refresh endpoint
  const refreshResponse = await fetch(`${API_URL}/auth/web/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies || ''
    },
    credentials: 'include'
  });

  if (!refreshResponse.ok) {
    console.error('Refresh failed:', refreshResponse.status);
    const error = await refreshResponse.text();
    console.error(error);
    return;
  }

  const refreshData = await refreshResponse.json();
  console.log('Refresh successful!');
  console.log('New access token received:', refreshData.accessToken ? 'Yes' : 'No');
  console.log('User data:', refreshData.user);
  
  // Check if new cookies were set
  const newCookies = refreshResponse.headers.get('set-cookie');
  console.log('New cookies received:', newCookies ? 'Yes' : 'No');
  
  console.log('\n✅ Refresh token functionality is working!');
}

// Run the test
testRefreshToken().catch(console.error);