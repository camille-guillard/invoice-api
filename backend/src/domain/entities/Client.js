export class Client {
  constructor({ id, name, email, address }) {
    this.validate({ name, email, address });

    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
  }

  validate({ name, email, address }) {
    if (!name || typeof name !== 'string') {
      throw new Error('Name is required and must be a string');
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Valid email is required');
    }
    if (!address || typeof address !== 'string') {
      throw new Error('Address is required and must be a string');
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      address: this.address
    };
  }
}
