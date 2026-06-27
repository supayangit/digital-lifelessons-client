import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

let client = null
let db = null
let auth = null
let ensureConnected = async () => {}

if (!uri) {
  console.warn('MONGODB_URI is missing — exporting stub auth and db for build-time')

  const noopCollection = () => ({
    findOne: async () => null,
    insertOne: async () => ({ insertedId: null }),
    updateOne: async () => ({}),
  })

  client = null
  db = { collection: noopCollection }
  auth = {
    api: {
      // During build we don't have a session; return null safely.
      getSession: async () => null,
    },
  }
} else {
  client = new MongoClient(uri)

  let connected = false
  ensureConnected = async () => {
    if (!connected) {
      try {
        await client.connect()
        connected = true
      } catch (err) {
        console.error('Failed to connect to MongoDB:', err)
        throw err
      }
    }
  }

  db = client.db('life-lessons')

  auth = betterAuth({
    database: mongodbAdapter(db, {
      client,
    }),

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },

    user: {
      additionalFields: {
        role: {
          default: 'user',
          type: 'string',
        },
        isPremium: {
          default: false,
          type: 'boolean',
        },
        premiumSince: {
          default: null,
          type: 'string',
          nullable: true,
        },
      },
    },

    socialProviders: {
      google: {
        prompt: 'select_account',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  })
}

export { client, db, auth, ensureConnected }