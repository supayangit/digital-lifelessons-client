'use client'

import { useSession } from '@/src/services/authApi'
import { logout, signInWithEmail, signInWithGoogle, registerWithEmail } from '@/src/services/authApi'

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
    signInWithEmail,
    signInWithGoogle,
    registerWithEmail,
    logout,
  }
}
