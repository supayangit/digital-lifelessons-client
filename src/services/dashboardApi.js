/**
 * Dashboard API — authenticated endpoints.
 */

import axiosPublic from './axios'

export async function getDashboardOverview(axiosSecure) {
  const instance = axiosSecure || axiosPublic
  try {
    const { data } = await instance.get('/api/dashboard/overview')
    console.log('[dashboardApi] overview success', data)
    return data
  } catch (err) {
    console.error('[dashboardApi] overview failed', err?.response?.data || err.message || err)
    throw err
  }
}
