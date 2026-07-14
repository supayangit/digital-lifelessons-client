import Stripe from 'stripe'
import { auth, db } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { resolveAuthSession, normalizeHeaders } from '@/lib/auth-utils'

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }
  return new Stripe(secretKey, {
    apiVersion: '2023-11-15',
  })
}

function buildUserFilter(userId) {
  if (!userId) return null

  const normalizedUserId = String(userId)
  const filters = []

  if (ObjectId.isValid(normalizedUserId)) {
    filters.push({ _id: new ObjectId(normalizedUserId) })
  }

  filters.push({ id: normalizedUserId })
  filters.push({ userId: normalizedUserId })

  return { $or: filters }
}

export async function GET(req) {
  try {
    const headers = normalizeHeaders(req.headers)
    const session = (auth.api && auth.api.getSession)
      ? await resolveAuthSession(auth, headers)
      : null

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const sessionId = url.searchParams.get('session_id')

    if (!sessionId) {
      return Response.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const stripe = getStripe()
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (!checkoutSession || checkoutSession.status !== 'complete') {
      return Response.json({ error: 'Checkout session not complete' }, { status: 400 })
    }

    const metadataUserId = checkoutSession.metadata?.userId
    const userId = metadataUserId || session.user._id || session.user.id || session.user.userId
    const filter = buildUserFilter(userId)

    if (!filter) {
      return Response.json({ error: 'Unable to resolve user for premium activation' }, { status: 400 })
    }

    const usersCol = db.collection('user')
    const result = await usersCol.updateOne(
      filter,
      {
        $set: {
          isPremium: true,
          premiumSince: new Date().toISOString(),
        },
      }
    )

    if (!result.matchedCount) {
      console.warn('Stripe confirm endpoint: no user found for', userId)
      return Response.json({ error: 'No matching user found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('GET /api/payments/confirm-checkout-session error:', error)
    return Response.json({ error: 'Failed to confirm checkout session' }, { status: 500 })
  }
}
