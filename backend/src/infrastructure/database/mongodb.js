import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer = null
let mongoClient = null
let db = null

/**
 * Initialize MongoDB connection (Memory Server in dev, real MongoDB in prod)
 */
export async function initMongoDB() {
  const useMemoryServer = process.env.USE_MEMORY_DB !== 'false'

  if (useMemoryServer) {
    console.log('Starting MongoDB Memory Server...')
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    mongoClient = new MongoClient(uri)
    console.log(`MongoDB Memory Server started at ${uri}`)
  } else {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    console.log(`Connecting to MongoDB at ${uri}`)
    mongoClient = new MongoClient(uri)
  }

  await mongoClient.connect()
  db = mongoClient.db('invoice-db')

  // Create indexes
  await createIndexes()

  console.log('MongoDB connected successfully')
  return db
}

/**
 * Create database indexes
 */
async function createIndexes() {
  // Invoice indexes
  await db.collection('invoices').createIndex({ number: 1 }, { unique: true })
  await db.collection('invoices').createIndex({ clientId: 1 })
  await db.collection('invoices').createIndex({ date: 1 })
  await db.collection('invoices').createIndex({ status: 1 })

  // Client indexes
  await db.collection('clients').createIndex({ name: 1 })
}

/**
 * Get MongoDB database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initMongoDB() first.')
  }
  return db
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDB() {
  if (mongoClient) {
    await mongoClient.close()
    console.log('MongoDB connection closed')
  }

  if (mongoServer) {
    await mongoServer.stop()
    console.log('MongoDB Memory Server stopped')
  }
}
