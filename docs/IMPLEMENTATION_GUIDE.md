# Frontend User API Integration - Implementation Guide

## Overview

This document provides a complete walkthrough of integrating the backend User Service APIs with the frontend React application. The integration includes data fetching, state management, field mapping, and real-time updates.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│         React Component (UserManagementModel)       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│     Custom Hook (useUsers)                          │
│   - State management (users, loading, error)        │
│   - API call orchestration                          │
│   - Data transformation                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│     User Service (userService.js)                   │
│   - API client methods                              │
│   - Data mapping functions                          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│     API Client (apiClient.js)                       │
│   - Axios instance with auth/interceptors           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│     Backend: http://localhost:5000/api/users        │
└─────────────────────────────────────────────────────┘
```

---

## 2. Data Flow & Field Mapping

### Backend Response (UserResponse DTO)
```json
{
  "id": 1,
  "email": "elena@skystream.com",
  "fullName": "Elena Vance",
  "phone": "+1-555-0101",
  "role": "ROLE_USER",
  "lastLoginAt": "2026-05-06T14:22:30"
}
```

### Frontend Model (Mapped)
```javascript
{
  id: "1",                                           // Long → String
  name: "Elena Vance",                               // fullName → name
  email: "elena@skystream.com",                      // As is
  phone: "+1-555-0101",                              // As is
  role: "ROLE_USER",                                 // As is
  active: true,                                      // From isActive
  lastLoginAt: "2026-05-06T14:22:30",               // As is
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena@skystream.com",  // Generated
  passport: ""                                       // Not available from API
}
```

### Mapping Logic
```javascript
// In userService.js
export const mapBackendUserToFrontendModel = (
  backendUser,
  defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed='
) => {
  return {
    id: String(backendUser.id),                      // Convert Long to String
    name: backendUser.fullName,                      // Rename field
    email: backendUser.email,
    phone: backendUser.phone || '',                  // Default to empty if undefined
    role: backendUser.role,
    active: backendUser.isActive !== undefined 
            ? backendUser.isActive 
            : true,                                  // Default to true
    lastLoginAt: backendUser.lastLoginAt,
    avatar: `${defaultAvatar}${backendUser.email}`,  // Generate from email
    passport: ''                                     // Not available
  };
};
```

---

## 3. File Structure & Components

### `src/api/userService.js`
**Purpose**: API client and data transformation layer

**Key Functions**:
- `userService.getAllUsers()` - Fetch all users
- `userService.getUserById(userId)` - Fetch single user
- `userService.updateUserStatus(userId, isActive)` - Update user status
- `userService.deleteUser(userId)` - Delete user
- `mapBackendUserToFrontendModel(backendUser)` - Transform backend response to frontend model

**Example Usage**:
```javascript
import { userService, mapBackendUserToFrontendModel } from '../api/userService';

// Fetch all users and map to frontend models
const backendUsers = await userService.getAllUsers();
const frontendUsers = mapBackendUsersToFrontendModels(backendUsers);

// Update user status
await userService.updateUserStatus(1, false); // Suspend user

// Delete user
await userService.deleteUser(1);
```

### `src/hooks/useUsers.js`
**Purpose**: Custom React hook for user state management

**Key State**:
- `users` - Array of user objects (frontend model)
- `loading` - Boolean flag for loading state
- `error` - String with error message if any

**Key Methods**:
- `fetchUsers()` - Async function to fetch all users
- `updateUserStatus(userId, isActive)` - Update user status with optimistic update
- `deleteUserById(userId)` - Delete user with optimistic removal
- `searchUsers(searchTerm)` - Local search in loaded users

**Example Usage**:
```javascript
import { useUsers } from '../hooks/useUsers';

function MyComponent() {
  const { users, loading, error, fetchUsers, updateUserStatus } = useUsers();
  
  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Update status
  const handleToggle = async (userId) => {
    try {
      await updateUserStatus(userId, true);
      // UI already updated (optimistic update)
    } catch (err) {
      console.error('Failed:', err);
    }
  };
  
  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {users.map(user => <div key={user.id}>{user.name}</div>)}
    </>
  );
}
```

### `src/components/models/UserManagementModel.jsx`
**Purpose**: React component for user management UI

**Features**:
- Displays list of users with search/filter
- Real-time loading & error states
- Delete confirmation dialog
- User status toggle with loading indicator
- Optimistic UI updates

**State**:
- `searchTerm` - Search query
- `deleteConfirm` - ID of user being deleted
- `actionLoading` - Tracks which action is loading

**Key Handlers**:
- `toggleStatus(userId)` - Call API to update user status
- `handleDelete(userId)` - Call API to delete user
- Search is done locally on already-loaded data

---

## 4. Step-by-Step Integration Example

### Step 1: API Client Setup (Already Done)
The `apiClient.js` is already configured with:
- Base URL: `http://localhost:5000/api`
- Authentication headers (Bearer token)
- Automatic token refresh on 401
- CORS credentials

### Step 2: Create User Service (Already Done)
```javascript
// src/api/userService.js
export const userService = {
  getAllUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  // ... other methods
};
```

### Step 3: Create Custom Hook (Already Done)
```javascript
// src/hooks/useUsers.js
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const backendUsers = await userService.getAllUsers();
      const frontendUsers = mapBackendUsersToFrontendModels(backendUsers);
      setUsers(frontendUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { users, loading, error, fetchUsers, /* ... */ };
};
```

### Step 4: Update Component (Already Done)
```javascript
// src/components/models/UserManagementModel.jsx
export default function UserManagementModel({ onClose }) {
  const { users, loading, error, fetchUsers, updateUserStatus, deleteUserById } = useUsers();
  
  useEffect(() => {
    fetchUsers(); // Fetch on mount
  }, [fetchUsers]);
  
  const handleDelete = async (userId) => {
    try {
      await deleteUserById(userId);
    } catch (err) {
      // Error displayed in UI
    }
  };
  
  return (
    // JSX with error states, loading spinner, user list
  );
}
```

---

## 5. API Request/Response Examples

### Example 1: Fetch All Users

**Request**:
```javascript
GET http://localhost:5000/api/users
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "email": "elena@skystream.com",
    "fullName": "Elena Vance",
    "phone": "+1-555-0101",
    "role": "ROLE_USER",
    "lastLoginAt": "2026-05-06T14:22:30"
  },
  {
    "id": 2,
    "email": "david@skystream.com",
    "fullName": "David Chen",
    "phone": "+1-555-0102",
    "role": "ROLE_AIRLINE_OWNER",
    "lastLoginAt": "2026-05-06T10:15:45"
  }
]
```

**Frontend Processing**:
```javascript
const backendUsers = [
  { id: 1, email: "elena@skystream.com", fullName: "Elena Vance", ... },
  { id: 2, email: "david@skystream.com", fullName: "David Chen", ... }
];

const frontendUsers = mapBackendUsersToFrontendModels(backendUsers);
// Result:
// [
//   { id: "1", name: "Elena Vance", email: "elena@skystream.com", ... },
//   { id: "2", name: "David Chen", email: "david@skystream.com", ... }
// ]
```

### Example 2: Update User Status

**Request**:
```javascript
PUT http://localhost:5000/api/users/1/status?isActive=false
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
```

**Response** (200 OK):
```json
{
  "message": "User active status updated successfully"
}
```

**Frontend**:
```javascript
// Optimistic update (before API response)
setUsers(prevUsers =>
  prevUsers.map(u =>
    u.id === "1" ? { ...u, active: false } : u
  )
);

// Async API call
try {
  await userService.updateUserStatus(1, false);
  // Update confirmed by server
} catch (err) {
  // Revert optimistic update if needed
  setUsers(prevUsers => /* revert */);
}
```

### Example 3: Delete User

**Request**:
```javascript
DELETE http://localhost:5000/api/users/1
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
```

**Response** (200 OK):
```json
{
  "message": "User deleted successfully"
}
```

**Frontend**:
```javascript
// Optimistic removal
setUsers(prevUsers =>
  prevUsers.filter(u => u.id !== "1")
);

// Async API call
try {
  await userService.deleteUser(1);
  // Removal confirmed by server
} catch (err) {
  // Revert removal if needed
  fetchUsers(); // Reload data
}
```

---

## 6. Error Handling

### Global Error Handler
```javascript
// In userService.js
export const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      const errorMessage = 
        error?.response?.data?.error || 
        error?.message || 
        'Failed to fetch users';
      console.error('Error:', errorMessage);
      throw error; // Re-throw for hook to handle
    }
  }
};
```

### Hook Error State
```javascript
// In useUsers.js
const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    setError(null); // Clear previous error
    const users = await userService.getAllUsers();
    setUsers(users);
  } catch (err) {
    const errorMessage = 
      err?.response?.data?.error || 
      err?.message || 
      'Failed to fetch users';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
}, []);
```

### Component Error Display
```javascript
// In UserManagementModel.jsx
{error && (
  <div className="p-4 bg-error/10 border border-error/30 rounded-2xl">
    <AlertCircle size={20} className="text-error" />
    <p className="text-error">{error}</p>
  </div>
)}
```

---

## 7. Optimistic Updates

### Pattern: Update Before API Response

```javascript
// When user toggles status
const toggleStatus = async (userId) => {
  const user = users.find(u => u.id === userId);
  const newStatus = !user.active;
  
  // 1. Optimistic update (immediate UI feedback)
  setUsers(prevUsers =>
    prevUsers.map(u =>
      u.id === userId ? { ...u, active: newStatus } : u
    )
  );
  
  try {
    // 2. API call (confirm with server)
    setActionLoading(`status-${userId}`);
    await userService.updateUserStatus(userId, newStatus);
    // Success - UI already updated
  } catch (err) {
    // 3. Rollback on failure
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === userId ? { ...u, active: !newStatus } : u
      )
    );
    setError(err.message);
  } finally {
    setActionLoading(null);
  }
};
```

**Benefits**:
- Instant UI feedback (no waiting for server)
- Better perceived performance
- Graceful rollback on error

---

## 8. Testing the Integration

### Manual Test Checklist

1. **Fetch Users**:
   - [ ] Component mounts
   - [ ] Loading spinner appears
   - [ ] Users list populates
   - [ ] No error displayed

2. **Search Users**:
   - [ ] Type in search box
   - [ ] List filters correctly
   - [ ] User count updates

3. **Update Status**:
   - [ ] Hover user to show buttons
   - [ ] Click status button
   - [ ] Loading spinner on button
   - [ ] User status updates immediately
   - [ ] Active/Suspended badge changes

4. **Delete User**:
   - [ ] Click delete button
   - [ ] Confirmation dialog appears
   - [ ] Cancel works
   - [ ] Confirm triggers deletion
   - [ ] User removed from list
   - [ ] Loading spinner shows during deletion

5. **Error Handling**:
   - [ ] Disconnect network
   - [ ] Error message displays
   - [ ] Retry button (if implemented)
   - [ ] Reconnect network

### Backend Prerequisites

**Required Environment**:
- Backend running on `http://localhost:5000`
- User Service active
- Valid JWT token in auth context
- Sample users in database

**Test with cURL**:
```bash
# Get all users
curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/users

# Update user status
curl -X PUT \
     -H "Authorization: Bearer <token>" \
     "http://localhost:5000/api/users/1/status?isActive=false"

# Delete user
curl -X DELETE \
     -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/users/1
```

---

## 9. Summary of Changes

### New Files Created
1. **`src/api/userService.js`** - User API client and mappers
2. **`src/hooks/useUsers.js`** - Custom React hook for user management

### Files Modified
1. **`src/components/models/UserManagementModel.jsx`** - Updated to use real API instead of mock data

### Key Features Implemented
✅ Real-time data fetching from backend  
✅ Proper field mapping (backend DTO → frontend model)  
✅ Loading states with spinner  
✅ Error handling with user feedback  
✅ Optimistic UI updates  
✅ User search/filter  
✅ User status toggle with API call  
✅ User deletion with confirmation  
✅ Disabled states during API calls  

---

## 10. Next Steps

1. **Test Integration**: Run frontend and test all features
2. **Add Pagination**: If user list grows large, implement server-side pagination
3. **Add Caching**: Implement React Query or SWR for better cache management
4. **Add Permissions**: Check user roles before showing delete/suspend buttons
5. **Add Audit Logging**: Track who modified which users
6. **Add Profile View**: Implement user profile modal with edit capabilities
7. **Add Bulk Actions**: Allow selecting multiple users for bulk operations
