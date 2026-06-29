'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { login, signup, logout, signInWithGoogle } from '@/lib/auth-client'
import { getMyProfile } from '@/services/userApi'

/**
 * Primary auth hook.
 * Fetches fresh user data from /api/users/me on every request.
 * Does not depend on better-auth's useSession() to avoid context issues.
 */
export function useAuth() {
  const queryClient = useQueryClient()

  const { data: user, isPending, error, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const data = await getMyProfile()
        return data
      } catch (err) {
        // User is likely not authenticated
        if (err.response?.status === 401) {
          return null
        }
        throw err
      }
    },
    retry: false,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Never cache
    refetchOnWindowFocus: false,
  })

  return {
    user: user || null,
    isPending,
    error,
    isAuthenticated: Boolean(user),
    refetch,
    login,
    signup,
    signInWithGoogle,
    logout,
  }
}
