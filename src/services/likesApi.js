import axiosPublic from './axios'

/**
 * Likes API — authenticated endpoints.
 */

export async function getMyLikes(params = {}, axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.get('/api/likes/my-likes', { params })
  return data
}

export async function addLike(lessonId, axiosSecure) {
  console.log('addLike request', { lessonId })
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.post('/api/likes', { lessonId })
  console.log('addLike response', { lessonId, data })
  return data
}

export async function removeLike(lessonId, axiosSecure) {
  console.log('removeLike request', { lessonId })
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.delete(`/api/likes/${lessonId}`)
  console.log('removeLike response', { lessonId, data })
  return data
}
