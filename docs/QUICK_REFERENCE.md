# Quick Reference: User API Integration

## 📊 API Endpoints Quick View

| Endpoint | Method | Purpose | Key Params |
|----------|--------|---------|-----------|
| `/api/users` | GET | Get all users | None |
| `/api/users/{id}` | GET | Get single user | `id`: User ID |
| `/api/users/profile` | GET | Get by email | Header: `X-User-Email` |
| `/api/users/{id}/status` | PUT | Update status | `isActive`: true/false |
| `/api/users/{id}` | DELETE | Delete user | `id`: User ID |

---

## 🔄 Data Mapping Reference

### Backend Field → Frontend Field

```
Backend UserResponse          Frontend User Model
├─ id (Long)             →    id (String)
├─ email                 →    email
├─ fullName              →    name
├─ phone                 →    phone
├─ role                  →    role
├─ isActive              →    active
├─ lastLoginAt           →    lastLoginAt
└─ [none]                →    avatar (generated from email)
                         →    passport (empty)
```

### Example Transformation
```javascript
// Backend Response
{
  "id": 1,
  "email": "elena@skystream.com",
  "fullName": "Elena Vance",
  "phone": "+1-555-0101",
  "role": "ROLE_USER",
  "isActive": true,
  "lastLoginAt": "2026-05-06T14:22:30"
}

// After Mapping
{
  "id": "1",
  "email": "elena@skystream.com",
  "name": "Elena Vance",
  "phone": "+1-555-0101",
  "role": "ROLE_USER",
  "active": true,
  "lastLoginAt": "2026-05-06T14:22:30",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=elena@skystream.com",
  "passport": ""
}
```

---

## 🎯 Hook Usage Examples

### Basic Usage
```javascript
import { useUsers } from '../hooks/useUsers';

export default function MyComponent() {
  const { users, loading, error, fetchUsers } = useUsers();
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {users.map(user => <div key={user.id}>{user.name}</div>)}
    </>
  );
}
```

### With Actions
```javascript
const { 
  users, 
  loading, 
  error, 
  fetchUsers, 
  updateUserStatus, 
  deleteUserById, 
  searchUsers 
} = useUsers();

// Toggle user status
await updateUserStatus(userId, newStatus);

// Delete user
await deleteUserById(userId);

// Search
const filtered = searchUsers('john');
```

---

## 🔌 API Service Usage Examples

### Single Call Examples
```javascript
import { userService, mapBackendUserToFrontendModel } from '../api/userService';

// Get all users
const users = await userService.getAllUsers();

// Get by ID
const user = await userService.getUserById(1);

// Get by email
const user = await userService.getUserProfile('user@example.com');

// Update status
await userService.updateUserStatus(1, true);

// Delete
await userService.deleteUser(1);

// Map response
const frontendUser = mapBackendUserToFrontendModel(backendUser);
```

---

## 📝 Component Integration Pattern

```javascript
import { useUsers } from '../hooks/useUsers';

export default function UserList() {
  const { users, loading, error, fetchUsers, updateUserStatus, deleteUserById } = useUsers();
  
  // 1. Fetch on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // 2. Handle actions with error handling
  const handleToggle = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      await updateUserStatus(userId, !user.active);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };
  
  // 3. Render with states
  return (
    <>
      {error && <ErrorBanner message={error} />}
      {loading && <LoadingSpinner />}
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onToggle={handleToggle}
        />
      ))}
    </>
  );
}
```

---

## 🛠️ Error Handling Pattern

```javascript
try {
  setLoading(true);
  setError(null);
  const result = await userService.getAllUsers();
  setUsers(result);
} catch (err) {
  // Extract error message from response
  const message = 
    err?.response?.data?.error || 
    err?.message || 
    'Unknown error';
  setError(message);
  console.error('Failed:', err);
} finally {
  setLoading(false);
}
```

---

## 📍 File Structure

```
frontend/src/
├── api/
│   ├── apiClient.js              (Already configured)
│   └── userService.js            (NEW - API client + mappers)
├── hooks/
│   ├── useAuth.js                (Already exists)
│   └── useUsers.js               (NEW - State management)
└── components/
    └── models/
        └── UserManagementModel.jsx (UPDATED - Uses API)
```

---

## ✅ Checklist: Integration Complete

- [x] Backend User Service API endpoints documented
- [x] Data mapping strategy defined
- [x] API client (`userService.js`) created
- [x] Custom hook (`useUsers.js`) created
- [x] Component updated with API integration
- [x] Error handling implemented
- [x] Loading states added
- [x] Optimistic updates implemented
- [x] Documentation complete

---

## 🚀 To Start Using

1. **Backend must be running** on `http://localhost:5000`
2. **Frontend imports updated** - Components use `useUsers` hook
3. **Test the integration** - See test checklist in IMPLEMENTATION_GUIDE.md

---

## 💡 Tips & Tricks

### Disable button during API call
```javascript
<button 
  disabled={actionLoading === `delete-${userId}`}
  onClick={handleDelete}
>
  {actionLoading === `delete-${userId}` ? 'Deleting...' : 'Delete'}
</button>
```

### Show loading spinner
```javascript
import { Loader } from 'lucide-react';

{loading && <Loader className="animate-spin" />}
```

### Display error alert
```javascript
{error && (
  <div className="p-4 bg-error/10 rounded-lg border border-error/30">
    <p className="text-error">{error}</p>
  </div>
)}
```

### Search users locally
```javascript
const filtered = searchUsers('john');
// Searches in: name, email, id
```

### Optimistic update pattern
```javascript
// Update UI immediately
setUsers(prevUsers => 
  prevUsers.map(u => 
    u.id === targetId ? {...u, active: !u.active} : u
  )
);

// Call API (rollback on fail)
try {
  await userService.updateUserStatus(targetId, newStatus);
} catch (err) {
  // Revert: setUsers(prevUsers => ...)
}
```

---

## 🔗 Related Documentation

- [USER_API_INTEGRATION.md](./USER_API_INTEGRATION.md) - Full API specification
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Detailed implementation guide
- Backend: `microservices/services/user-service/`

