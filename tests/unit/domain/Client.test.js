import { describe, it, expect } from 'vitest';
import { Client } from '../../../src/domain/entities/Client.js';

describe('Client', () => {
  describe('constructor', () => {
    it('should create client with valid data', () => {
      const client = new Client({
        id: '123',
        name: 'Test Company',
        email: 'contact@company.com',
        address: '123 Test Street'
      });

      expect(client.id).toBe('123');
      expect(client.name).toBe('Test Company');
      expect(client.email).toBe('contact@company.com');
      expect(client.address).toBe('123 Test Street');
    });

    it('should throw error without name', () => {
      expect(() => new Client({
        id: '123',
        email: 'test@example.com',
        address: '123 Street'
      })).toThrow('Name is required and must be a string');
    });

    it('should throw error with non-string name', () => {
      expect(() => new Client({
        id: '123',
        name: 123,
        email: 'test@example.com',
        address: '123 Street'
      })).toThrow('Name is required and must be a string');
    });

    it('should throw error without email', () => {
      expect(() => new Client({
        id: '123',
        name: 'Test',
        address: '123 Street'
      })).toThrow('Valid email is required');
    });

    it('should throw error with invalid email', () => {
      expect(() => new Client({
        id: '123',
        name: 'Test',
        email: 'invalid-email',
        address: '123 Street'
      })).toThrow('Valid email is required');
    });

    it('should throw error with non-string email', () => {
      expect(() => new Client({
        id: '123',
        name: 'Test',
        email: 123,
        address: '123 Street'
      })).toThrow('Valid email is required');
    });

    it('should throw error without address', () => {
      expect(() => new Client({
        id: '123',
        name: 'Test',
        email: 'test@example.com'
      })).toThrow('Address is required and must be a string');
    });

    it('should throw error with non-string address', () => {
      expect(() => new Client({
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        address: 123
      })).toThrow('Address is required and must be a string');
    });
  });

  describe('toJSON', () => {
    it('should serialize client to JSON', () => {
      const client = new Client({
        id: '123',
        name: 'Test Company',
        email: 'contact@company.com',
        address: '123 Test Street'
      });

      const json = client.toJSON();

      expect(json).toEqual({
        id: '123',
        name: 'Test Company',
        email: 'contact@company.com',
        address: '123 Test Street'
      });
    });
  });
});
