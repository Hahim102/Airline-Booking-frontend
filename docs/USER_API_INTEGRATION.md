# User API Integration Guide

## 1. Backend API Endpoints

### Base URL: `http://localhost:5000/api/users`

| Method | Endpoint | Description | Headers/Params | Response |
|--------|----------|-------------|-----------------|----------|
| GET | `/profile` | Get user profile by email | Header: `X-User-Email` | `UserResponse` |
| GET | `/me` | Get current user profile | Header: `X-User-Email` | `UserResponse` |
| GET | `/{userId}` | Get user by ID | Path: `userId` (Long) | `UserResponse` |
| GET | `` | Get all users | - | `List<UserResponse>` |
| PUT | `/{userId}/status` | Update user active status | Path: `userId`, Query: `isActive` (boolean) | `{ message: string }` |
| DELETE | `/{userId}` | Soft delete user | Path: `userId` | `{ message: string }` |

---

## 2. Backend Data Models

### Users (Database Entity)
```java
{
  id: Long,
  email: String (unique),
  password: String (encrypted),
  fullName: String,
  phone: String,
  role: UserRole,
  isActive: boolean,
  isDeleted: boolean (soft delete),
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime,
  deletedAt: LocalDateTime,
  lastLoginAt: LocalDateTime
}
```

### UserRole Enum
```java
ROLE_SYSTEM_ADMIN
ROLE_USER
ROLE_AIRLINE_OWNER
```

### UserResponse (API Response DTO)
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "ROLE_USER",
  "lastLoginAt": "2026-05-06T10:30:00"
}
```

### UserDTO (API Request DTO - for creation/update)
```json
{
  "email": "user@example.com",
  "password": "hashedPassword",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

---

## 3. Example API Responses

### GET /api/users (Get All Users)
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
  },
  {
    "id": 3,
    "email": "alex@skystream.com",
    "fullName": "Alex Turner",
    "phone": "+1-555-0103",
    "role": "ROLE_SYSTEM_ADMIN",
    "lastLoginAt": null
  }
]
```

### GET /api/users/{userId}
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

### PUT /api/users/{userId}/status
```json
{
  "message": "User active status updated successfully"
}
```

### DELETE /api/users/{userId}
```json
{
  "message": "User deleted successfully"
}
```

---

## 4. Field Mapping: Backend → Frontend

| Backend Field | Frontend Field | Type | Transformation |
|---------------|----------------|------|-----------------|
| `id` | `id` | Long → String | Convert to string |
| `fullName` | `name` | String | As is |
| `email` | `email` | String | As is |
| `phone` | `phone` | String | As is |
| `isActive` | `active` | boolean | As is |
| `role` | `role` | UserRole | Store enum value |
| `lastLoginAt` | `lastLoginAt` | LocalDateTime | Format as needed |
| - | `avatar` | String | N/A (use placeholder or from auth context) |
| - | `passport` | String | N/A (not available from user service) |

**Mapping Rules:**
- `id`: Must be converted from Long to String for frontend display
- `fullName` → `name`: Direct mapping
- `isActive` → `active`: Direct boolean mapping
- `avatar`: Can be fetched from Auth context or use a default avatar placeholder
- `passport`: Not available from user service (might be in a separate profile service)

---

## 5. Error Handling

### Common HTTP Status Codes
- **200 OK**: Success
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "User not found with email: invalid@example.com",
  "timestamp": "2026-05-06T14:22:30",
  "status": 404
}
```

---

## 6. Integration Notes

1. **Authentication**: All endpoints require `X-User-Email` header or Bearer token authentication
2. **CORS**: Configured to accept requests from frontend (`localhost:5173` or deployment URL)
3. **Soft Delete**: Users marked as `isDeleted=true` are excluded from most queries
4. **Rate Limiting**: No explicit rate limiting configured (add as needed)
5. **Caching**: No caching strategy implemented (consider for GET /api/users)

---

## 7. Frontend Implementation Steps

1. Create `userService.js` - API client for user endpoints
2. Create `useUsers.js` hook - State management for user data
3. Update `UserManagementModel.jsx` - Replace mock data with real API calls
4. Add error handling and loading states
5. Implement field mapping from backend to frontend models

See implementation files:
- `api/userService.js` - API client
- `hooks/useUsers.js` - Custom hook
- Updated `components/models/UserManagementModel.jsx` - Integration
