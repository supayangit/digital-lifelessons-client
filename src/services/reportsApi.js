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

export async function submitReport(lessonId, reason, axiosSecure) {
  const { data } = await axiosSecure.post('/api/reports', { lessonId, reason })
  return data
}

export async function toggleLike(lessonId, axiosSecure) {
  const { data } = await axiosSecure.patch(`/api/lessons/${lessonId}/like`)
  return data
}
