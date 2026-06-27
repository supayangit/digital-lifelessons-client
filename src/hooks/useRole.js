'use client'

import { useAuth } from './useAuth'

/**
 * Returns the current user's role.
 * Possible values: 'free' | 'premium' | 'admin' | 'ceo' | null
 */
export function useRole() {
  const { user, isPending } = useAuth()

  const role = user?.role ?? null

  const isPremium = Boolean(user?.isPremium)

  return {
    role,
    isAdmin: role === 'admin' || role === 'ceo',
    isCeo: role === 'ceo',
    // Primary source of truth: user.isPremium (from fresh API call, never cached)
    isPremium,
    isPending,
  }
}
