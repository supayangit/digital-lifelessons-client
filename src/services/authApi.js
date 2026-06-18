import { createAuthClient } from 'better-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

/**
 * Better Auth client — connects to the backend's /api/auth endpoint.
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient

/**
 * Sign in with email and password.
 */
export async function signInWithEmail({ email, password }) {
  return authClient.signIn.email({ email, password })
}

/**
 * Sign in with Google OAuth.
 */
export async function signInWithGoogle() {
  return authClient.signIn.social({
    provider: 'google',
    callbackURL: `${typeof window !== 'undefined' ? window.location.origin : ''}/`,
  })
}

/**
 * Register a new user with email, password and name.
 */
export async function registerWithEmail({ name, email, password }) {
  return authClient.signUp.email({ name, email, password })
}

/**
 * Sign out the current user.
 */
export async function logout() {
  return authClient.signOut()
}
