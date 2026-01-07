import { Client } from '../../domain/entities/Client.js'
import { getDatabase } from '../database/mongodb.js'

export class MongoClientRepository {
  constructor() {
    this.db = null
  }

  // Initialize collection
  getCollection() {
    if (!this.db) {
      this.db = getDatabase()
    }
    return this.db.collection('clients')
  }

  // Convert MongoDB document to Client entity
  toEntity(doc) {
    if (!doc) return null

    return new Client({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      address: doc.address
    })
  }

  // Convert Client entity to MongoDB document
  toDocument(client) {
    return {
      _id: client.id,
      name: client.name,
      email: client.email,
      address: client.address
    }
  }

  async save(client) {
    const collection = this.getCollection()
    const doc = this.toDocument(client)

    await collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true }
    )

    return client
  }

  async findById(id) {
    const collection = this.getCollection()
    const doc = await collection.findOne({ _id: id })
    return this.toEntity(doc)
  }

  async findAll() {
    const collection = this.getCollection()
    const docs = await collection.find({}).sort({ name: 1 }).toArray()
    return docs.map(doc => this.toEntity(doc))
  }

  async delete(id) {
    const collection = this.getCollection()
    await collection.deleteOne({ _id: id })
  }

  async deleteAll() {
    const collection = this.getCollection()
    await collection.deleteMany({})
  }
}
