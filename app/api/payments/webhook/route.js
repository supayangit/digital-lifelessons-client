import Stripe from 'stripe'
import { db } from '@/lib/auth'
import { ObjectId } from 'mongodb'

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

export async function POST(req) {
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeWebhookSecret) {
    console.error('Stripe webhook secret is not configured')
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing Stripe signature', { status: 400 })
  }

  const payload = await req.text()
  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret)
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error)
    return new Response('Invalid webhook signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId

    if (userId) {
      const usersCol = db.collection('user')
      const filter = buildUserFilter(userId)
      if (filter) {
        try {
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
            console.warn('Stripe webhook: no user found for metadata.userId', userId)
          }
        } catch (error) {
          console.error('Failed to update user premium status:', error)
        }
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
