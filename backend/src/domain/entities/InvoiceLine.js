export class InvoiceLine {
  constructor({ description, quantity, unitPrice, vatRate }) {
    this.validate({ description, quantity, unitPrice, vatRate });

    this.description = description;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.vatRate = vatRate;
  }

  validate({ description, quantity, unitPrice, vatRate }) {
    if (!description || typeof description !== 'string') {
      throw new Error('Description is required and must be a string');
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }
    if (typeof unitPrice !== 'number' || unitPrice <= 0) {
      throw new Error('Unit price must be a positive number');
    }
    const validVatRates = [0, 5.5, 10, 20];
    if (!validVatRates.includes(vatRate)) {
      throw new Error('VAT rate must be one of: 0, 5.5, 10, 20');
    }
  }

  toJSON() {
    return {
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      vatRate: this.vatRate
    };
  }
}
