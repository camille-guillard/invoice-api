export class InvoiceController {
  constructor(container) {
    this.container = container;
  }

  async createInvoice(req, res) {
    try {
      const { clientId, lines } = req.body;

      if (!clientId || !lines || !Array.isArray(lines)) {
        return res.status(400).json({ error: 'clientId and lines are required' });
      }

      const useCase = this.container.getCreateInvoiceUseCase();
      const invoice = await useCase.execute({ clientId, lines });

      res.status(201).json(invoice.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getInvoice(req, res) {
    try {
      const { id } = req.params;

      const useCase = this.container.getGetInvoiceUseCase();
      const invoice = await useCase.execute(id);

      res.json(invoice.toJSON());
    } catch (error) {
      if (error.message === 'Invoice not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async listInvoices(req, res) {
    try {
      const { status, startDate, endDate, clientId } = req.query;

      const useCase = this.container.getListInvoicesUseCase();
      const invoices = await useCase.execute({ status, startDate, endDate, clientId });

      res.json(invoices.map(inv => inv.toJSON()));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async markInvoiceAsPaid(req, res) {
    try {
      const { id } = req.params;

      const useCase = this.container.getMarkInvoiceAsPaidUseCase();
      const invoice = await useCase.execute(id);

      res.json(invoice.toJSON());
    } catch (error) {
      if (error.message === 'Invoice not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getRevenue(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate are required' });
      }

      const useCase = this.container.getGetRevenueUseCase();
      const revenue = await useCase.execute({ startDate, endDate });

      res.json(revenue);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
