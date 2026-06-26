'use client'

import { useAuth } from './useAuth'

/**
 * Returns the current user's role.
 * Possible values: 'free' | 'premium' | 'admin' | null
 */
export function useRole() {
  const { user, isPending } = useAuth()

  const role = user?.role ?? null

  return {
    role,
    isAdmin: role === 'admin',
    // primary source of truth: user.isPremium (boolean)
    isPremium: Boolean(user?.isPremium),
    isPending,
  }
}
