'use client'

import { useSession, login, signup, logout, signInWithGoogle } from '@/lib/auth-client'

/**
 * Primary auth hook.
 * Returns the current user, session state, and auth actions.
 */
export function useAuth() {
  const { data: session, isPending, error } = useSession()

  const user = session?.user ?? null

  return {
    user,
    session,
    isPending,
    error,
    isAuthenticated: Boolean(user),
    login,
    signup,
    signInWithGoogle,
    logout,
  }
}
