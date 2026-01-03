import { InvoiceLine } from './InvoiceLine.js';

export const InvoiceStatus = {
  DRAFT: 'DRAFT',
  PAID: 'PAID'
};

export class Invoice {
  constructor({ id, number, date, status = InvoiceStatus.DRAFT, clientId, lines, totalExcludingTax, totalVat, totalIncludingTax }) {
    this.validate({ lines, clientId });

    this.id = id;
    this.number = number;
    this.date = date || new Date().toISOString();
    this.status = status;
    this.clientId = clientId;
    this.lines = lines.map(line => line instanceof InvoiceLine ? line : new InvoiceLine(line));
    this.totalExcludingTax = totalExcludingTax || 0;
    this.totalVat = totalVat || 0;
    this.totalIncludingTax = totalIncludingTax || 0;
  }

  validate({ lines, clientId }) {
    if (!clientId || typeof clientId !== 'string') {
      throw new Error('Client ID is required');
    }
    if (!Array.isArray(lines) || lines.length === 0) {
      throw new Error('Invoice must have at least one line');
    }
  }

  markAsPaid() {
    if (this.status === InvoiceStatus.PAID) {
      throw new Error('Invoice is already paid');
    }
    this.status = InvoiceStatus.PAID;
  }

  isDraft() {
    return this.status === InvoiceStatus.DRAFT;
  }

  isPaid() {
    return this.status === InvoiceStatus.PAID;
  }

  setTotals(totalExcludingTax, totalVat, totalIncludingTax) {
    this.totalExcludingTax = totalExcludingTax;
    this.totalVat = totalVat;
    this.totalIncludingTax = totalIncludingTax;
  }

  toJSON() {
    return {
      id: this.id,
      number: this.number,
      date: this.date,
      status: this.status,
      clientId: this.clientId,
      lines: this.lines.map(line => line.toJSON()),
      totalExcludingTax: this.totalExcludingTax,
      totalVat: this.totalVat,
      totalIncludingTax: this.totalIncludingTax
    };
  }
}
