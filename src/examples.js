/* Demo Authentication Hook Examples and Testing */

/**
 * TESTING GUIDE FOR AUTHENTICATION FLOW
 * 
 * To test the authentication system, you need a backend that provides:
 * - POST /auth/login
 * - POST /auth/refresh
 * - POST /auth/logout
 */

// ============================================================================
// EXAMPLE 1: Using Auth in a Component
// ============================================================================

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function MyComponent() {
  const { user, isLoading, isAuthenticated, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  // Example: Check if user is authenticated
  if (!isAuthenticated) {
    return <div>Please log in first</div>;
  }

  // Example: Check specific role
  if (hasRole('ROLE_SYSTEM_ADMIN')) {
    return <div>Admin content here</div>;
  }

  // Example: Check multiple roles
  if (!hasRole('ROLE_USER')) {
    return <div>You don't have user access</div>;
  }

  // Example: Display user roles
  return (
    <div>
      <p>Your roles: {user?.roles?.join(', ')}</p>
      <button onClick={async () => {
        await logout();
        navigate('/login');
      }}>
        Logout
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Mock Backend Setup for Development
// ============================================================================

/**
 * If you want to test locally without a backend, you can mock axios:
 * 
 * 1. Install msw (Mock Service Worker):
 *    npm install msw --save-dev
 * 
 * 2. Create src/mocks/handlers.js:
 */

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock login endpoint
  http.post('http://localhost:8080/api/auth/login', async ({ request }) => {
    const body = await request.json();

    // Simple credentials check
    if (body.email === 'ops.manager@skystream.com' && body.password === 'demo123') {
      return HttpResponse.json({
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        roles: ['ROLE_USER'],
      });
    }

    if (body.email === 'admin@skystream.com' && body.password === 'admin123') {
      return HttpResponse.json({
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        roles: ['ROLE_SYSTEM_ADMIN'],
      });
    }

    if (body.email === 'airline@skystream.com' && body.password === 'airline123') {
      return HttpResponse.json({
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        roles: ['ROLE_AIRLINE_OWNER'],
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Mock refresh token endpoint
  http.post('http://localhost:8080/api/auth/refresh', () => {
    return HttpResponse.json({
      accessToken: 'mock_access_token_' + Date.now(),
    });
  }),

  // Mock logout endpoint
  http.post('http://localhost:8080/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out' });
  }),
];

/**
 * 3. Create src/mocks/browser.js:
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

/**
 * 4. Update src/main.jsx:
 */

// ... other imports
if (import.meta.env.DEV) {
  // Only use mocks in development
  const { worker } = await import('./mocks/browser');
  await worker.start();
}

// ============================================================================
// EXAMPLE 3: Testing Protected Routes
// ============================================================================

/**
 * Test case 1: User not logged in tries to access /admin
 * 
 * Expected: Redirect to /login
 * 
 * Manual test:
 * 1. Go to http://localhost:5173
 * 2. It redirects to /login (good)
 * 3. Click browser back button - redirects again to /login (good)
 */

/**
 * Test case 2: User with ROLE_USER tries to access /admin
 * 
 * Expected: Redirect to /403
 * 
 * Manual test:
 * 1. Login with ops.manager@skystream.com
 * 2. You should see /user page
 * 3. Try accessing /admin directly - should see 403 page
 */

/**
 * Test case 3: User with ROLE_SYSTEM_ADMIN tries to access /admin
 * 
 * Expected: Show admin page
 * 
 * Manual test:
 * 1. Login with admin@skystream.com
 * 2. Should see /admin page
 * 3. Navbar should show "Admin" link
 */

// ============================================================================
// EXAMPLE 4: Testing Axios Interceptors
// ============================================================================

/**
 * Open browser DevTools Network tab and:
 * 
 * Test 1: Request includes Bearer token
 * 1. Login successfully
 * 2. Make any API request
 * 3. In Network tab, check request headers
 * 4. Should see: Authorization: Bearer <token>
 * 
 * Test 2: Token refresh on 401
 * 1. Login successfully
 * 2. Backend returns 401 (simulate by server)
 * 3. Should see: First request fails with 401
 * 4. Then: POST to /auth/refresh
 * 5. Then: Original request retried with new token
 * 
 * Test 3: Logout when refresh fails
 * 1. Simulate refresh endpoint returning 401
 * 2. Should automatically logout
 * 3. Redirect to /login
 */

// ============================================================================
// EXAMPLE 5: Backend API Requirements
// ============================================================================

/**
 * Your backend MUST implement these endpoints:
 * 
 * 1. POST /auth/login
 *    Request:  { email, password }
 *    Response: { accessToken, refreshToken, roles }
 *    
 * 2. POST /auth/refresh
 *    Request:  {} (cookies sent automatically with withCredentials)
 *    Response: { accessToken }
 *    Notes:    - Set refreshToken in httpOnly cookie
 *              - Make sure CORS allows credentials
 *    
 * 3. POST /auth/logout
 *    Request:  {}
 *    Response: { message: "..." }
 *    Notes:    - Clear refreshToken cookie
 * 
 * CORS Configuration needed:
 * - Allow Origin: http://localhost:5173 (dev) or your domain (prod)
 * - Allow Credentials: true
 * - Allow Methods: GET, POST, PUT, DELETE, OPTIONS
 * - Allow Headers: Content-Type, Authorization
 */

// ============================================================================
// EXAMPLE 6: Token Payload Structure
// ============================================================================

/**
 * JWT Access Token should contain (optional, for reference):
 * {
 *   "sub": "user@example.com",
 *   "roles": ["ROLE_USER"],
 *   "exp": 1234567890,
 *   "iat": 1234567800
 * }
 * 
 * Your backend extracts roles from the JWT and includes them
 * in the login response.
 */

// ============================================================================
// EXAMPLE 7: Complete Login Flow Diagram
// ============================================================================

/**
 * 
 *  USER                      FRONTEND                     BACKEND
 *    |                           |                            |
 *    |------ enters creds ------->|                            |
 *    |                           |------- POST /login -------->|
 *    |                           |                  generates token
 *    |                           |<------ token, roles ---------|
 *    |                           | stores in React state
 *    |<----- redirected ---------|                            |
 *    |      to /user            |                            |
 *    |                           |                            |
 *    |-- clicks on something --->|                            |
 *    |                           |-- API request +token ------>|
 *    |                           |<------ 401 response --------|
 *    |                           |     token expired
 *    |                           |-- POST /refresh ---------->|
 *    |                           |     (cookie sent auto)
 *    |                           |<--- new token -------------|
 *    |                           |-- API request + new token ->|
 *    |                           |<------ 200 response --------|
 *    |<----- data loaded --------|                            |
 *    |                           |                            |
 *    |---- clicks logout ------->|                            |
 *    |                           |-- POST /logout ------------>|
 *    |                           |<----- success -------------|
 *    |                           | clears state
 *    |<----- redirected ---------|                            |
 *    |      to /login           |                            |
 * 
 */

// ============================================================================
// EXAMPLE 8: Error Handling
// ============================================================================

/**
 * Login error scenarios:
 * 
 * 1. Invalid credentials
 *    Response: 401 with message
 *    Frontend: Shows error on login page
 * 
 * 2. Network error
 *    Response: Network error
 *    Frontend: Shows "Connection failed" message
 * 
 * 3. Server error
 *    Response: 500 error
 *    Frontend: Shows "Something went wrong" message
 * 
 * 4. Refresh token expired
 *    Response: 401 from refresh endpoint
 *    Frontend: Logout user, redirect to login
 */

export {};
