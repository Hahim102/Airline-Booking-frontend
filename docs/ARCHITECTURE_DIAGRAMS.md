# Architecture & Data Flow Diagrams

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend React App                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         UserManagementModel Component              │  │
│  │  - Displays user list                              │  │
│  │  - Search functionality                            │  │
│  │  - Delete confirmation dialog                      │  │
│  │  - Status toggle buttons                           │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │ Uses                                │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            useUsers Custom Hook                     │  │
│  │  - Users state (array)                             │  │
│  │  - Loading state (boolean)                         │  │
│  │  - Error state (string)                            │  │
│  │  - fetchUsers()                                    │  │
│  │  - updateUserStatus()                              │  │
│  │  - deleteUserById()                                │  │
│  │  - searchUsers()                                   │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │ Calls                               │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           userService.js (API Client)               │  │
│  │  - userService.getAllUsers()                        │  │
│  │  - userService.getUserById()                        │  │
│  │  - userService.updateUserStatus()                   │  │
│  │  - userService.deleteUser()                         │  │
│  │  - mapBackendUserToFrontendModel()                  │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │ Uses                                │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        apiClient.js (Axios Instance)                │  │
│  │  - Base URL: localhost:5000/api                     │  │
│  │  - Auth interceptor (Bearer token)                  │  │
│  │  - Error interceptor (token refresh)                │  │
│  │  - CORS credentials enabled                         │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │ HTTP Requests                       │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ GET/PUT/DELETE
                        │ /api/users/*
                        ▼
┌─────────────────────────────────────────────────────────────┐
│             Backend - User Service (Spring Boot)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           UserController                            │  │
│  │  - GET  /api/users                                  │  │
│  │  - GET  /api/users/{id}                             │  │
│  │  - PUT  /api/users/{id}/status                      │  │
│  │  - DELETE /api/users/{id}                           │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           UserService (Business Logic)              │  │
│  │  - getUserById()                                    │  │
│  │  - getAllUsers()                                    │  │
│  │  - updateIsActiveStatus()                           │  │
│  │  - deleteUser()                                     │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        UserRepository (Data Access)                 │  │
│  │  - findByIdAndDeletedIsFalse()                       │  │
│  │  - findAllByDeletedIsFalse()                         │  │
│  │  - save()                                           │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Database (Oracle)                        │  │
│  │  - Users Table                                      │  │
│  │    - id, email, fullName, phone                     │  │
│  │    - role, isActive, isDeleted                      │  │
│  │    - timestamps (created, updated, deleted, login) │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Data Transformation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend Database                         │
│                                                             │
│  Users Table:                                              │
│  ┌────────────────────────────────────────────────┐        │
│  │ id │ email   │ fullName │ phone │ isActive │  │        │
│  ├────┼─────────┼──────────┼───────┼──────────┤  │        │
│  │ 1  │ elena@..│ Elena... │ +1-... │ true   │  │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend UserResponse DTO                       │
│                                                             │
│  {                                                          │
│    "id": 1,                                                │
│    "email": "elena@skystream.com",                         │
│    "fullName": "Elena Vance",                              │
│    "phone": "+1-555-0101",                                 │
│    "role": "ROLE_USER",                                    │
│    "isActive": true,                                       │
│    "lastLoginAt": "2026-05-06T14:22:30"                   │
│  }                                                          │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
        [HTTP Response (200 OK)]
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│          Frontend mapBackendUserToFrontendModel()           │
│                                                             │
│  Transformations:                                           │
│  • id (Long) → id (String)                                 │
│  • fullName → name                                         │
│  • isActive → active                                       │
│  • Generate avatar from email                              │
│  • Add empty passport field                                │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│          Frontend User Model (React State)                  │
│                                                             │
│  {                                                          │
│    "id": "1",                                              │
│    "name": "Elena Vance",                                  │
│    "email": "elena@skystream.com",                         │
│    "phone": "+1-555-0101",                                 │
│    "role": "ROLE_USER",                                    │
│    "active": true,                                         │
│    "lastLoginAt": "2026-05-06T14:22:30",                  │
│    "avatar": "https://api.dicebear.com/...",              │
│    "passport": ""                                          │
│  }                                                          │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         React Component (UserManagementModel)               │
│                                                             │
│  Renders:                                                  │
│  • User avatar image                                       │
│  • User name, email, phone                                 │
│  • Active/Suspended badge                                  │
│  • Action buttons (toggle status, delete)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. User Interaction Flow

```
┌─────────────────────────────────────────────────────┐
│   User Opens UserManagementModel Component          │
└──────────────────┬────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  useEffect Hook      │
        │  Runs on Mount       │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  fetchUsers()        │
        │  Called from Hook    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  setLoading(true)    │
        │  Show Spinner        │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │  GET /api/users                  │
        │  API Call via axios              │
        └──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    Success                 Error
        │                     │
        ▼                     ▼
  ┌──────────────┐    ┌──────────────┐
  │ mapToFrontend│    │ setError()   │
  │ Transform    │    │ Show Alert   │
  └──────────────┘    └──────────────┘
        │                     │
        ▼                     │
  ┌──────────────┐           │
  │ setUsers()   │           │
  │ Update State │           │
  └──────────────┘           │
        │                     │
        ▼                     ▼
  ┌──────────────┐    ┌──────────────┐
  │ setLoading   │    │ User Retries │
  │ (false)      │    │ fetchUsers() │
  │ Hide Spinner │    └──────────────┘
  └──────────────┘
        │
        ▼
  ┌─────────────────────────────────┐
  │  Render User List               │
  │  • Users mapped to JSX          │
  │  • Search input focused         │
  └─────────────────────────────────┘
        │
        ▼
  ┌──────────────────────────────────┐
  │  User Actions:                   │
  │  1. Search → searchUsers()       │
  │  2. Toggle → updateUserStatus()  │
  │  3. Delete → deleteUserById()    │
  └──────────────────────────────────┘
        │
        ▼
  ┌──────────────────────────────────┐
  │  Optimistic Update:              │
  │  Update UI immediately           │
  │  (before API response)           │
  └──────────────────────────────────┘
        │
        ▼
  ┌──────────────────────────────────┐
  │  API Call Completes:             │
  │  • Success → Confirm state       │
  │  • Failure → Rollback state      │
  └──────────────────────────────────┘
```

---

## 4. State Management

```
┌────────────────────────────────────────────────────────┐
│            useUsers Hook State Variables               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  users: User[]                                         │
│  ├─ Populated by: fetchUsers()                         │
│  ├─ Updated by: updateUserStatus(), deleteUserById()  │
│  ├─ Displayed in: UserManagementModel                  │
│  └─ Type: Array of transformed User objects           │
│                                                        │
│  loading: boolean                                      │
│  ├─ Initial: false                                     │
│  ├─ Set true: During API calls                         │
│  ├─ Set false: After API completes (success/error)    │
│  ├─ Used for: Loading spinners, button disable        │
│  └─ Type: boolean                                      │
│                                                        │
│  error: string | null                                  │
│  ├─ Initial: null                                      │
│  ├─ Set to: Error message on API failure              │
│  ├─ Cleared: Before each new API call                 │
│  ├─ Displayed in: Error alert banner                  │
│  └─ Type: string or null                              │
│                                                        │
├────────────────────────────────────────────────────────┤
│           useUsers Hook Methods                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  fetchUsers()                                          │
│  ├─ Action: GET /api/users                            │
│  ├─ Updates: users state                              │
│  ├─ Sets: loading, error                              │
│  └─ Usage: useEffect on mount                         │
│                                                        │
│  updateUserStatus(userId, isActive)                   │
│  ├─ Action: PUT /api/users/{userId}/status            │
│  ├─ Optimistic: Updates users state immediately       │
│  ├─ Rollback: On error                                │
│  └─ Usage: Toggle button click                        │
│                                                        │
│  deleteUserById(userId)                               │
│  ├─ Action: DELETE /api/users/{userId}                │
│  ├─ Optimistic: Removes from users array              │
│  ├─ Rollback: On error                                │
│  └─ Usage: Delete confirmation                        │
│                                                        │
│  searchUsers(searchTerm)                              │
│  ├─ Action: Local array filter                        │
│  ├─ Filter by: name, email, id                        │
│  ├─ Returns: Filtered users array                     │
│  └─ Usage: Search input onChange                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 5. Error Handling Flow

```
┌──────────────────────────────────────────────────────┐
│          API Call Fails                              │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Error Caught in Hook         │
        │ try/catch block              │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────────────┐
        │ Extract Error Message:                   │
        │ error?.response?.data?.error (from API)  │
        │ OR error?.message (standard error)       │
        │ OR generic error message                 │
        └──────────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ setError(errorMessage)       │
        │ Update error state           │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ setLoading(false)            │
        │ Hide loading spinner         │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────────────┐
        │ Component Re-renders                     │
        │ {error && <ErrorAlert>{error}</ErrorAlert>} │
        └──────────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────────────┐
        │ User Sees Error Message                  │
        │ + Retry Options (fetch/refresh)          │
        └──────────────────────────────────────────┘
```

---

## 6. API Call Sequence Diagram

```
Frontend                 Backend
   │                       │
   │  1. GET /api/users    │
   ├──────────────────────>│
   │  (with Bearer token)  │
   │                       │
   │                  2. Fetch from DB
   │                  3. Transform to DTO
   │                  4. Validate authorization
   │                       │
   │  5. 200 OK + JSON    │
   │<──────────────────────┤
   │  [UserResponse[]]     │
   │                       │
   │  6. Map to Frontend   │
   │     Model             │
   │                       │
   │  7. Update state      │
   │                       │
   │  8. Re-render UI      │
   │
   │
   │  [User clicks toggle] │
   │                       │
   │  9. PUT /api/users/1  │
   │     /status?isActive  │
   ├──────────────────────>│
   │  (Optimistic update)  │
   │                       │
   │            10. Update DB
   │            11. Return 200 OK
   │                       │
   │  12. Response OK      │
   │<──────────────────────┤
   │                       │
   │  13. Keep optimistic  │
   │      update           │
   │                       │
   │  [API error occurs]   │
   │                       │
   │  14. 500 Server Error │
   │<──────────────────────┤
   │                       │
   │  15. Rollback state   │
   │                       │
   │  16. Show error msg   │
   │                       │
```

---

## 7. Component Hierarchy

```
App
├── Layout
│   ├── TopNav
│   ├── SlideBar
│   └── MainContent
│       ├── HomePage / Dashboard / etc.
│       └── Modal.jsx (wraps UserManagementModel)
│           │
│           ├── UserManagementModel.jsx ★
│           │   ├── useUsers Hook (calls)
│           │   ├── SearchInput
│           │   ├── UsersList
│           │   │   └── UserCard (x many)
│           │   │       ├── Avatar
│           │   │       ├── UserInfo
│           │   │       ├── ActionButtons
│           │   │       └── DeleteConfirmDialog
│           │   ├── ErrorAlert
│           │   └── LoadingSpinner
│           │
│           └── Related Files:
│               ├── src/hooks/useUsers.js ★
│               │   └── userService.js ★
│               │       └── apiClient.js
│               │
│               └── src/api/userService.js ★
│                   └── apiClient.js
│
★ = New/Updated files for this integration
```

---

## 8. Field Mapping Matrix

```
┌──────────────────┬─────────────────┬──────────────┬──────────────────┐
│  Backend DTO     │  Type           │  Frontend    │  Transformation  │
├──────────────────┼─────────────────┼──────────────┼──────────────────┤
│  id              │  Long           │  id          │  String()        │
│  email           │  String         │  email       │  As-is           │
│  fullName        │  String         │  name        │  Rename          │
│  phone           │  String         │  phone       │  "" if null      │
│  role            │  UserRole enum  │  role        │  As-is           │
│  isActive        │  boolean        │  active      │  Rename          │
│  lastLoginAt     │  LocalDateTime  │  lastLoginAt │  As-is           │
│  password        │  String         │  —           │  Excluded        │
│  isDeleted       │  boolean        │  —           │  Excluded        │
│  —               │  —              │  avatar      │  Generated       │
│  —               │  —              │  passport    │  "" (hardcoded)  │
└──────────────────┴─────────────────┴──────────────┴──────────────────┘

Legend:
  String()     = JavaScript type conversion
  Rename       = Field name changed
  As-is        = No transformation needed
  "" if null   = Default to empty string
  Excluded     = Not included in frontend model
  Generated    = Created from other fields
  "" (hardcoded) = Empty string constant
```

---

## 9. Error Types & Handling

```
API Error
│
├─ Network Error (No connection)
│  └─ Message: "Failed to connect to server"
│     Action: Show retry button, check backend status
│
├─ Authentication Error (401)
│  ├─ Cause: Invalid/expired token
│  ├─ Action: Automatic token refresh via interceptor
│  └─ Fallback: Redirect to login if refresh fails
│
├─ Authorization Error (403)
│  ├─ Cause: User lacks permission
│  ├─ Message: "You do not have permission to perform this action"
│  └─ Action: Show error, disable buttons
│
├─ Not Found Error (404)
│  ├─ Cause: User doesn't exist / endpoint missing
│  ├─ Message: "User not found" (from backend)
│  └─ Action: Refresh list, show error
│
├─ Server Error (5xx)
│  ├─ Cause: Backend error
│  ├─ Message: "An error occurred on the server"
│  └─ Action: Log error, retry, notify admin
│
└─ Validation Error (400)
   ├─ Cause: Invalid request data
   ├─ Message: Error from backend validation
   └─ Action: Show field validation errors
```

---

These diagrams provide a comprehensive visual reference for understanding the
frontend-backend integration architecture, data flow, and error handling patterns.

