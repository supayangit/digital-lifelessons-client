'use client'

/**
 * AuthProvider
 * Better-auth manages session state via its useSession hook directly.
 * This provider wraps the app and can be extended with context if needed.
 */
export function AuthProvider({ children }) {
  return <>{children}</>
}
