export class InvoiceCalculator {
  /**
   * Calculate the total amount excluding tax for an invoice line
   */
  calculateLineTotal(line) {
    return Math.round(line.quantity * line.unitPrice * 100) / 100;
  }

  /**
   * Calculate the VAT amount for an invoice line
   */
  calculateLineVat(line) {
    const total = this.calculateLineTotal(line);
    return Math.round(total * (line.vatRate / 100) * 100) / 100;
  }

  /**
   * Calculate invoice totals (excluding tax, VAT, including tax)
   */
  calculateInvoiceTotals(invoice) {
    let totalExcludingTax = 0;
    let totalVat = 0;

    for (const line of invoice.lines) {
      totalExcludingTax += this.calculateLineTotal(line);
      totalVat += this.calculateLineVat(line);
    }

    // Round to 2 decimals
    totalExcludingTax = Math.round(totalExcludingTax * 100) / 100;
    totalVat = Math.round(totalVat * 100) / 100;
    const totalIncludingTax = Math.round((totalExcludingTax + totalVat) * 100) / 100;

    return {
      totalExcludingTax,
      totalVat,
      totalIncludingTax
    };
  }
}
