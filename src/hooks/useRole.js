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
    isFree: role === 'free' || (!isPending && !role),
    isPremiumRole: role === 'premium',
    isPending,
  }
}
