/**
 * Auth API Service
 * Delegating to the unified auth client in lib/auth-client.js
 * All functions are now centralized in auth-client.js
 */

export {
  signup,
  login,
  logout,
  getSession,
  signInWithGoogle,
  authClient,
  useSession,
} from "@/lib/auth-client";

