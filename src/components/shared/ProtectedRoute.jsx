'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorState } from './ErrorState'

/**
 * ProtectedRoute — Wrapper component that guards content based on auth state.
 * Uses the same /api/users/me check that the navbar uses.
 */
export function ProtectedRoute({ children, fallback = null }) {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return fallback || (
      <ErrorState
        title="Access Denied"
        message="You must be logged in to access this content."
      />
    )
  }

  return children
}
