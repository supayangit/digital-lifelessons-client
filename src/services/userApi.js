import axiosPublic from './axios'

/**
 * Fetch the current user's profile.
 */
export async function getMyProfile(axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.get('/api/users/me')
  return data
}

/**
 * Update the current user's profile.
 */
export async function updateMyProfile(profileData, axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.put('/api/users/me', profileData)
  return data
}

/**
 * Fetch the current user's saved lessons.
 */
export async function getMySavedLessons(axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.get('/api/users/me/saved-lessons')
  return data
}

/**
 * Fetch the current user's created lessons.
 */
export async function getMyLessons(axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.get('/api/users/me/lessons')
  return data
}

/**
 * Fetch a public user profile by ID.
 */
export async function getUserById(id) {
  const { data } = await axiosPublic.get(`/api/users/${id}`)
  return data
}
