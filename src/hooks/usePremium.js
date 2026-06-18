'use client'

import { useRole } from './useRole'

/**
 * Returns whether the current user has premium access.
 */
export function usePremium() {
  const { role, isPremiumRole, isAdmin, isPending } = useRole()

  // Admins also get premium access
  const isPremium = isPremiumRole || isAdmin

  return {
    isPremium,
    isPending,
    role,
  }
}
