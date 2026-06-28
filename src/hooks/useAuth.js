'use client'

import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { login, signup, logout, signInWithGoogle, useSession } from '@/lib/auth-client'
import { getMyProfile } from '@/services/userApi'

/**
 * Primary auth hook.
 * Fetches fresh user data from /api/users/me on every request.
 * Never uses cached session data.
 */
export function useAuth() {
  const queryClient = useQueryClient()
  const { data: session, isPending: sessionPending } = useSession()

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

  useEffect(() => {
    if (session !== undefined) {
      queryClient.invalidateQueries({ queryKey: ['currentUser'], refetchType: 'active' })
    }
  }, [queryClient, session])

  return {
    user: user || null,
    isPending: isPending || sessionPending,
    error,
    isAuthenticated: Boolean(user),
    refetch,
    login,
    signup,
    signInWithGoogle,
    logout,
  }
}
