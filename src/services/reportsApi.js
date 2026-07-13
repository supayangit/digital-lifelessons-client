/**
 * Reports API — authenticated endpoint.
 */

export const REPORT_REASONS = [
  'Spam',
  'Harassment',
  'Misleading',
  'Inappropriate',
  'Other',
]

import axiosPublic from './axios'

export async function submitReport(lessonId, reason, axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.post('/api/reports', { lessonId, reason })
  return data
}

export async function toggleLike(lessonId, axiosSecure) {
  const instance = axiosSecure || axiosPublic
  const { data } = await instance.patch(`/api/lessons/${lessonId}/like`)
  return data
}
