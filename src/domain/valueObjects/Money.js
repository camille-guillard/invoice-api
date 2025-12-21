export class Money {
  constructor(amount, currency = 'EUR') {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Amount must be a positive number');
    }
    if (typeof currency !== 'string' || currency.length !== 3) {
      throw new Error('Currency must be a 3-letter code');
    }
    this.amount = Math.round(amount * 100) / 100; // Round to 2 decimals
    this.currency = currency;
  }

  add(other) {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error('Factor must be a positive number');
    }
    return new Money(this.amount * factor, this.currency);
  }

  equals(other) {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency
    };
  }
}
