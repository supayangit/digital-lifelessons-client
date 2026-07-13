/**
 * Favorites API — authenticated endpoints.
 */

import axiosPublic from './axios'

export async function getMyFavorites(params = {}, axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.get('/api/favorites/my-favorites', { params })
  return data
}

export async function addFavorite(lessonId, axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.post('/api/favorites', { lessonId })
  return data
}

export async function removeFavorite(lessonId, axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.delete(`/api/favorites/${lessonId}`)
  return data
}

