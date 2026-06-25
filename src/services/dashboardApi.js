/**
 * Dashboard API — authenticated endpoints.
 */

export async function getDashboardOverview(axiosSecure) {
  const { data } = await axiosSecure.get('/api/dashboard/overview')
  console.log('dashboard overview', data)
  return data
}
