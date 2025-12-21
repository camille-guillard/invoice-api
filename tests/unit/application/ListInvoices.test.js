import { describe, it, expect, beforeEach } from 'vitest';
import { ListInvoices } from '../../../src/application/usecases/ListInvoices.js';

describe('ListInvoices', () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: async () => [],
      findByFilters: async () => []
    };
    useCase = new ListInvoices(mockRepository);
  });

  it('should call findAll when no filters provided', async () => {
    const invoices = [{ id: '1' }, { id: '2' }];
    mockRepository.findAll = async () => invoices;

    const result = await useCase.execute();

    expect(result).toBe(invoices);
  });

  it('should call findAll when empty filters object provided', async () => {
    const invoices = [{ id: '1' }];
    mockRepository.findAll = async () => invoices;

    const result = await useCase.execute({});

    expect(result).toBe(invoices);
  });

  it('should call findByFilters when status is provided', async () => {
    const invoices = [{ id: '1', status: 'PAID' }];
    let calledWith = null;
    mockRepository.findByFilters = async (filters) => {
      calledWith = filters;
      return invoices;
    };

    const result = await useCase.execute({ status: 'PAID' });

    expect(result).toBe(invoices);
    expect(calledWith).toEqual({ status: 'PAID', startDate: undefined, endDate: undefined, clientId: undefined });
  });

  it('should call findByFilters when only startDate is provided', async () => {
    const invoices = [{ id: '1' }];
    let calledWith = null;
    mockRepository.findByFilters = async (filters) => {
      calledWith = filters;
      return invoices;
    };

    const result = await useCase.execute({ startDate: '2025-01-01' });

    expect(result).toBe(invoices);
    expect(calledWith).toEqual({ status: undefined, startDate: '2025-01-01', endDate: undefined, clientId: undefined });
  });

  it('should call findByFilters when only endDate is provided', async () => {
    const invoices = [{ id: '1' }];
    let calledWith = null;
    mockRepository.findByFilters = async (filters) => {
      calledWith = filters;
      return invoices;
    };

    const result = await useCase.execute({ endDate: '2025-12-31' });

    expect(result).toBe(invoices);
    expect(calledWith).toEqual({ status: undefined, startDate: undefined, endDate: '2025-12-31', clientId: undefined });
  });

  it('should call findByFilters when only clientId is provided', async () => {
    const invoices = [{ id: '1' }];
    let calledWith = null;
    mockRepository.findByFilters = async (filters) => {
      calledWith = filters;
      return invoices;
    };

    const result = await useCase.execute({ clientId: 'client-1' });

    expect(result).toBe(invoices);
    expect(calledWith).toEqual({ status: undefined, startDate: undefined, endDate: undefined, clientId: 'client-1' });
  });

  it('should call findByFilters when multiple filters are provided', async () => {
    const invoices = [{ id: '1' }];
    let calledWith = null;
    mockRepository.findByFilters = async (filters) => {
      calledWith = filters;
      return invoices;
    };

    const result = await useCase.execute({
      status: 'DRAFT',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      clientId: 'client-1'
    });

    expect(result).toBe(invoices);
    expect(calledWith).toEqual({
      status: 'DRAFT',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      clientId: 'client-1'
    });
  });

  it('should call findByFilters when status and startDate are provided', async () => {
    const invoices = [{ id: '1' }];
    mockRepository.findByFilters = async () => invoices;

    const result = await useCase.execute({ status: 'PAID', startDate: '2025-01-01' });

    expect(result).toBe(invoices);
  });

  it('should call findByFilters when status and endDate are provided', async () => {
    const invoices = [{ id: '1' }];
    mockRepository.findByFilters = async () => invoices;

    const result = await useCase.execute({ status: 'PAID', endDate: '2025-12-31' });

    expect(result).toBe(invoices);
  });

  it('should call findByFilters when startDate and endDate are provided', async () => {
    const invoices = [{ id: '1' }];
    mockRepository.findByFilters = async () => invoices;

    const result = await useCase.execute({ startDate: '2025-01-01', endDate: '2025-12-31' });

    expect(result).toBe(invoices);
  });
});
