'use client'

import { useQuery } from '@tanstack/react-query'
import { login, signup, logout, signInWithGoogle } from '@/lib/auth-client'
import { getMyProfile } from '@/services/userApi'

/**
 * Primary auth hook.
 * Fetches fresh user data from /api/users/me on every request.
 * Does not depend on better-auth's useSession() to avoid context issues.
 */
export function useAuth() {
  const { data: user, isLoading, isPending, isFetching, error, refetch } = useQuery({
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
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes before refetching
      gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
    refetchOnWindowFocus: false,
  })

  const isAuthLoading = isLoading || isPending || isFetching

  const loginWithRefresh = async (credentials) => {
    const response = await login(credentials)
    await refetch()
    return response
  }

  const signInWithGoogleWithRefresh = async () => {
    const response = await signInWithGoogle()
    await refetch()
    return response
  }

  const logoutWithRefresh = async () => {
    const response = await logout()
    await refetch()
    return response
  }

  return {
    user: user || null,
    isLoading: isAuthLoading,
    isPending: isAuthLoading,
    error,
    isAuthenticated: Boolean(user),
    refetch,
    login: loginWithRefresh,
    signup,
    signInWithGoogle: signInWithGoogleWithRefresh,
    logout: logoutWithRefresh,
  }
}
