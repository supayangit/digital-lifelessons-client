# Simplified Auth Setup Guide

## Overview
Your authentication system is now simplified with a unified setup using only two core files and localhost:3000 (frontend).

## Core Auth Files

### 1. **`lib/auth.js`** - Server-Side Configuration
- Configures better-auth with MongoDB adapter
- Handles email/password and Google OAuth
- Exposes the `auth` object used by the API route
- **No need to modify** - used automatically by `/api/auth/[...all]/route.js`

### 2. **`lib/auth-client.js`** - Client-Side Client & Functions
All auth functions and the auth client are centralized here:

**Functions Available:**
- `signup({ name, email, password })` - Register a new user
- `login({ email, password })` - Sign in with email/password
- `signInWithGoogle()` - Sign in with Google OAuth
- `logout()` - Sign out the current user
- `getSession()` - Get current session (server or client)
- `useSession()` - React hook for session state
- `authClient` - The raw better-auth client object

**Usage Example:**
```javascript
import { login, signup, logout, useSession } from '@/lib/auth-client'

// In a client component
const { data: session } = useSession()
const result = await login({ email: 'user@example.com', password: 'pass123' })
```

## Integration Points

### 3. **`src/hooks/useAuth.js`** - Main Auth Hook
The primary hook for accessing auth functionality in components:

```javascript
import { useAuth } from '@/src/hooks/useAuth'

export function MyComponent() {
  const { user, isAuthenticated, login, signup, logout, signInWithGoogle } = useAuth()
  
  // Use the functions as needed
}
```

**Hook Returns:**
- `user` - Current user object (or null)
- `session` - Full session object
- `isAuthenticated` - Boolean flag
- `isPending` - Loading state
- `error` - Error object if any
- `login()`, `signup()`, `logout()`, `signInWithGoogle()` - Auth functions

### 4. **`src/services/authApi.js`** - Backward Compatibility Layer
Simple re-export of all functions from `auth-client.js` for backward compatibility.

## Authentication Flow

### Sign Up
```javascript
const { signup } = useAuth()
const result = await signup({ name: 'John', email: 'john@example.com', password: 'Pass123' })
```

### Sign In
```javascript
const { login } = useAuth()
const result = await login({ email: 'john@example.com', password: 'Pass123' })
```

### Sign Out
```javascript
const { logout } = useAuth()
await logout()
```

### Get Current User
```javascript
const { user, session } = useAuth()
console.log(user) // Current user or null
```

## API Routes

**Auth Endpoint:** `/api/auth/[...all]/route.js`
- Automatically handles all authentication requests
- Powered by better-auth
- Uses MongoDB for persistence
- Supports email/password and Google OAuth

**BaseURL:** `http://localhost:3000` (localhost frontend only)

## Updated Components

### Pages Updated
- ✅ `app/auth/login/page.jsx` - Uses `login` from useAuth
- ✅ `app/auth/register/page.jsx` - Uses `signup` from useAuth

### Components Updated
- ✅ `src/components/shared/Navbar.jsx` - Uses `logout` from auth-client

### Hooks Updated
- ✅ `src/hooks/useAuth.js` - Centralized auth functions
- ✅ `src/hooks/useAxiosSecure.js` - Uses auth-client for session

## Environment Variables

No changes needed (already configured correctly):
- `NEXT_PUBLIC_AUTH_URL` not required (defaults to http://localhost:3000)
- `MONGODB_URI` - Required for backend connection
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Required for Google OAuth

## Key Benefits

1. ✅ **Single Source of Truth** - All auth functions in one file
2. ✅ **Simplified Imports** - Import from `lib/auth-client` or via `useAuth` hook
3. ✅ **Frontend Only** - Uses localhost:3000, no external API needed
4. ✅ **Better Auth** - Leverages proven better-auth library
5. ✅ **Type Safe** - Works with TypeScript (can add types later)
6. ✅ **Session Management** - Automatic session handling via hooks

## Common Patterns

### Protected Route Example
```javascript
'use client'
import { useAuth } from '@/src/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }
  
  return <div>Welcome, {user?.name}</div>
}
```

### Sign Out Example
```javascript
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  router.push('/')
}
```

## Troubleshooting

**"Session is null"**
- Wait for `useSession` loading to complete (`isPending` is false)
- Check that `/api/auth/[...all]/route.js` exists and is configured

**"CORS errors"**
- Verify baseURL is `http://localhost:3000`
- Check that cookies are enabled
- Ensure credentials are being sent (`withCredentials: true`)

**"Google OAuth not working"**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Check Google Cloud Console has correct redirect URIs

---

*Last Updated: 2026-06-24*
