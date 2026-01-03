import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Invoice API',
      version: '1.0.0',
      description: 'Invoice management REST API with hexagonal architecture',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Invoices',
        description: 'Invoice management endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoint'
      }
    ],
    components: {
      schemas: {
        InvoiceLine: {
          type: 'object',
          required: ['description', 'quantity', 'unitPrice', 'vatRate'],
          properties: {
            description: {
              type: 'string',
              example: 'Web development service'
            },
            quantity: {
              type: 'number',
              minimum: 0.01,
              example: 2
            },
            unitPrice: {
              type: 'number',
              minimum: 0.01,
              example: 500
            },
            vatRate: {
              type: 'number',
              enum: [0, 5.5, 10, 20],
              example: 20
            }
          }
        },
        Invoice: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
            },
            number: {
              type: 'string',
              pattern: '^INV-\\d{4}-\\d{3}$',
              example: 'INV-2025-001'
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-19T10:00:00.000Z'
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PAID'],
              example: 'DRAFT'
            },
            clientId: {
              type: 'string',
              format: 'uuid',
              example: 'b3a398fd-4d2c-4233-9b95-0b1d5aaf5b8d'
            },
            lines: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/InvoiceLine'
              }
            },
            totalExcludingTax: {
              type: 'number',
              example: 1000
            },
            totalVat: {
              type: 'number',
              example: 200
            },
            totalIncludingTax: {
              type: 'number',
              example: 1200
            }
          }
        },
        CreateInvoiceRequest: {
          type: 'object',
          required: ['clientId', 'lines'],
          properties: {
            clientId: {
              type: 'string',
              format: 'uuid',
              example: 'b3a398fd-4d2c-4233-9b95-0b1d5aaf5b8d'
            },
            lines: {
              type: 'array',
              minItems: 1,
              items: {
                $ref: '#/components/schemas/InvoiceLine'
              }
            }
          }
        },
        Revenue: {
          type: 'object',
          properties: {
            startDate: {
              type: 'string',
              format: 'date',
              example: '2025-01-01'
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2025-12-31'
            },
            totalRevenue: {
              type: 'number',
              example: 12000
            },
            invoiceCount: {
              type: 'integer',
              example: 5
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Client not found'
            }
          }
        }
      }
    }
  },
  apis: ['./src/infrastructure/http/routes/*.js', './src/infrastructure/http/server.js']
};

export const swaggerSpec = swaggerJsdoc(options);
