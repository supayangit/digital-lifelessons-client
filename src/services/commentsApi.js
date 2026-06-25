/**
 * Comments API — public read, authenticated write/delete.
 */
import axiosPublic from './axios'

export async function getComments(lessonId) {
  const { data } = await axiosPublic.get(`/api/comments/${lessonId}`)
  console.log(`[CommentsAPI] Received comments for lesson ${lessonId}`, data)
  return data
}

export async function addComment(lessonId, content, axiosSecure) {
  const { data } = await axiosSecure.post('/api/comments', { lessonId, content })
  console.log(`[CommentsAPI] Comment posted for lesson ${lessonId}`, data)
  return data
}

export async function deleteComment(commentId, axiosSecure) {
  const { data } = await axiosSecure.delete(`/api/comments/${commentId}`)
  console.log(`[CommentsAPI] Deleted comment ${commentId}`, data)
  return data
}
