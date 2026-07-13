import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Public axios instance — no auth headers required.
 */
const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Attach stored session token as a Bearer Authorization header when available.
// This helps server endpoints resolve sessions when cookies are not present
// (e.g. after client-side sign-in where some environments return token only).
axiosPublic.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined' && window?.localStorage) {
      const token = window.localStorage.getItem('better-auth.session_token')
      if (token) {
        config.headers = config.headers || {}
        if (!config.headers.Authorization && !config.headers.authorization) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    }
  } catch (e) {
    // ignore storage errors
  }
  return config
})

axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosPublic
