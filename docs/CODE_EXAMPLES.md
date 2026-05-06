# Code Examples & Snippets

Copy-paste ready code for common use cases.

---

## 1. Fetch and Display Users

### Simple List Component
```javascript
import { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Loader, AlertCircle } from 'lucide-react';

export function UsersList() {
  const { users, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-lg flex gap-3">
        <AlertCircle className="text-red-600" />
        <div>
          <p className="font-bold text-red-900">Error Loading Users</p>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {users.map(user => (
        <li key={user.id} className="p-4 border rounded-lg">
          <p className="font-bold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className={`text-xs font-bold ${user.active ? 'text-green-600' : 'text-red-600'}`}>
            {user.active ? 'Active' : 'Suspended'}
          </p>
        </li>
      ))}
    </ul>
  );
}
```

---

## 2. Update User Status

### Toggle User Active/Inactive
```javascript
export function UserCard({ user }) {
  const { updateUserStatus } = useUsers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    try {
      setLoading(true);
      setError(null);
      await updateUserStatus(user.id, !user.active);
      // UI already updated by hook
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-4 py-2 rounded font-bold transition ${
            user.active
              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              : 'bg-green-100 text-green-900 hover:bg-green-200'
          } disabled:opacity-50`}
        >
          {loading ? 'Updating...' : user.active ? 'Suspend' : 'Activate'}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
```

---

## 3. Delete User with Confirmation

### Delete with Confirmation Dialog
```javascript
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Trash2, AlertTriangle } from 'lucide-react';

export function UserDeleteButton({ user }) {
  const { deleteUserById } = useUsers();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteUserById(user.id);
      setShowConfirm(false);
      // User removed from list by hook
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm">
          <div className="flex gap-3 mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <p className="font-bold">Delete User?</p>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
      title="Delete user"
    >
      <Trash2 size={18} />
    </button>
  );
}
```

---

## 4. Search Users

### Search with Live Filtering
```javascript
import { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Search } from 'lucide-react';

export function UserSearch() {
  const { users, fetchUsers, searchUsers } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const results = searchUsers(searchTerm);
    setFilteredUsers(results);
  }, [searchTerm, users, searchUsers]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="text-sm text-gray-600">
        Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
      </div>

      <ul className="space-y-2">
        {filteredUsers.map(user => (
          <li key={user.id} className="p-4 border rounded-lg hover:bg-gray-50">
            <p className="font-bold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
          </li>
        ))}
      </ul>

      {filteredUsers.length === 0 && searchTerm && (
        <p className="text-center text-gray-600 py-8">
          No users found matching "{searchTerm}"
        </p>
      )}
    </div>
  );
}
```

---

## 5. Batch Operations

### Multi-Select Delete
```javascript
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Trash2 } from 'lucide-react';

export function UserListWithBulkDelete() {
  const { users, fetchUsers, deleteUserById } = useUsers();
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUser = (userId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelected(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.size} user(s)?`)) return;

    try {
      setLoading(true);
      // Delete each selected user
      await Promise.all(
        Array.from(selected).map(userId => deleteUserById(userId))
      );
      setSelected(new Set());
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg flex justify-between items-center">
          <p className="font-bold">{selected.size} user(s) selected</p>
          <button
            onClick={handleBulkDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex gap-2 items-center"
          >
            <Trash2 size={16} />
            {loading ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}

      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="p-4 border rounded-lg flex gap-4">
            <input
              type="checkbox"
              checked={selected.has(user.id)}
              onChange={() => toggleUser(user.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. Error Boundary

### Global Error Handler
```javascript
import { AlertCircle } from 'lucide-react';

export function ErrorBoundary({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 max-w-md bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-lg">
      <div className="flex gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
        <div className="flex-1">
          <p className="font-bold text-red-900">Something went wrong</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Manual API Calls

### Direct API Service Usage
```javascript
import { userService, mapBackendUserToFrontendModel } from '../api/userService';

// In a component or utility function
async function logUserDetails(userId) {
  try {
    // Fetch from backend
    const backendUser = await userService.getUserById(userId);
    
    // Transform to frontend model
    const frontendUser = mapBackendUserToFrontendModel(backendUser);
    
    console.log('User:', frontendUser);
    return frontendUser;
  } catch (err) {
    console.error('Failed to fetch user:', err);
    throw err;
  }
}

// Usage
const user = await logUserDetails(1);
```

---

## 8. Custom Hook for Single User

### Get and Update Single User
```javascript
import { useState, useCallback } from 'react';
import { userService, mapBackendUserToFrontendModel } from '../api/userService';

export function useSingleUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUser = await userService.getUserById(userId);
      const frontendUser = mapBackendUserToFrontendModel(backendUser);
      setUser(frontendUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateStatus = useCallback(async (isActive) => {
    try {
      setError(null);
      await userService.updateUserStatus(userId, isActive);
      // Update local state
      setUser(prev => prev ? { ...prev, active: isActive } : null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  return { user, loading, error, fetchUser, updateStatus };
}

// Usage
export function UserProfile({ userId }) {
  const { user, loading, error, fetchUser, updateStatus } = useSingleUser(userId);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {user && (
        <div>
          <h1>{user.name}</h1>
          <button onClick={() => updateStatus(!user.active)}>
            {user.active ? 'Suspend' : 'Activate'}
          </button>
        </div>
      )}
    </>
  );
}
```

---

## 9. Pagination Helper

### Paginate Local Data
```javascript
export function usePagination(items, pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(items.length / pageSize);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    goToPage: (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    nextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage(p => Math.max(p - 1, 1)),
  };
}

// Usage
export function PaginatedUserList() {
  const { users, fetchUsers } = useUsers();
  const { paginatedItems, currentPage, totalPages, nextPage, prevPage } =
    usePagination(users, 5);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      {paginatedItems.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={prevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={nextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}
```

---

## 10. Export Users to CSV

### Download User List
```javascript
export function ExportUserButton() {
  const { users } = useUsers();

  const handleExport = () => {
    // Prepare CSV data
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status'];
    const rows = users.map(u => [
      u.id,
      u.name,
      u.email,
      u.phone,
      u.role,
      u.active ? 'Active' : 'Suspended',
    ]);

    // Create CSV string
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Export to CSV
    </button>
  );
}
```

