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
  if (ObjectId.isValid(userId)) {
    return { _id: new ObjectId(userId) }
  }
  return { id: String(userId) }
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
          await usersCol.updateOne(
            filter,
            {
              $set: {
                isPremium: true,
                premiumSince: new Date().toISOString(),
              },
            }
          )
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
