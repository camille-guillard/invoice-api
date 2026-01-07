import { Invoice } from '../../domain/entities/Invoice.js'
import { InvoiceLine } from '../../domain/entities/InvoiceLine.js'
import { getDatabase } from '../database/mongodb.js'
import { randomUUID } from 'crypto'

export class MongoInvoiceRepository {
  constructor() {
    this.db = null
  }

  getNextId() {
    return randomUUID()
  }

  // Initialize collection
  getCollection() {
    if (!this.db) {
      this.db = getDatabase()
    }
    return this.db.collection('invoices')
  }

  // Convert MongoDB document to Invoice entity
  toEntity(doc) {
    if (!doc) return null

    const lines = doc.lines.map(
      line => new InvoiceLine({
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        vatRate: line.vatRate
      })
    )

    return new Invoice({
      id: doc._id.toString(),
      number: doc.number,
      clientId: doc.clientId,
      date: doc.date,
      status: doc.status,
      lines: lines,
      totalExcludingTax: doc.totalExcludingTax,
      totalVat: doc.totalVat,
      totalIncludingTax: doc.totalIncludingTax
    })
  }

  // Convert Invoice entity to MongoDB document
  toDocument(invoice) {
    return {
      _id: invoice.id,
      number: invoice.number,
      clientId: invoice.clientId,
      date: invoice.date,
      status: invoice.status,
      lines: invoice.lines.map(line => ({
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        vatRate: line.vatRate
      })),
      totalExcludingTax: invoice.totalExcludingTax,
      totalVat: invoice.totalVat,
      totalIncludingTax: invoice.totalIncludingTax
    }
  }

  async save(invoice) {
    const collection = this.getCollection()
    const doc = this.toDocument(invoice)

    await collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true }
    )

    return invoice
  }

  async findById(id) {
    const collection = this.getCollection()
    const doc = await collection.findOne({ _id: id })
    return this.toEntity(doc)
  }

  async findByNumber(number) {
    const collection = this.getCollection()
    const doc = await collection.findOne({ number })
    return this.toEntity(doc)
  }

  async findAll(filters = {}) {
    const collection = this.getCollection()
    const query = {}

    // Apply filters
    if (filters.clientId) {
      query.clientId = filters.clientId
    }

    if (filters.status) {
      query.status = filters.status
    }

    if (filters.startDate || filters.endDate) {
      query.date = {}
      if (filters.startDate) {
        query.date.$gte = filters.startDate.split('T')[0]
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate.split('T')[0]
      }
    }

    const docs = await collection.find(query).sort({ date: -1 }).toArray()
    return docs.map(doc => this.toEntity(doc))
  }

  async findByFilters(filters = {}) {
    return this.findAll(filters)
  }

  async countByYear(year) {
    const collection = this.getCollection()
    // Use regex to match year in date string (YYYY-MM-DD)
    const count = await collection.countDocuments({
      number: new RegExp(`^INV-${year}-`)
    })
    return count
  }

  async getNextInvoiceNumber(year) {
    const count = await this.countByYear(year)
    const nextNumber = count + 1
    return `INV-${year}-${String(nextNumber).padStart(3, '0')}`
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
