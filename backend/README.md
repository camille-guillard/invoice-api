# invoice-app

Invoice management REST API built with Hexagonal Architecture using Node.js and Express.

## Tech Stack

- **Node.js** + **Express.js**
- **Hexagonal Architecture** (Ports & Adapters)
- **Vitest** for testing
- **In-memory** database
- **Swagger UI** for API documentation

## Installation

```bash
npm install
```

## Main Commands

### Start the application

```bash
npm start
```

The server starts on **http://localhost:3000**

At startup, 2 test clients are automatically created (IDs are displayed in the console).

### Tests

```bash
# Run all tests
npm test

# Watch mode (auto-reload)
npm run test:watch

# Tests with code coverage
npm run test:coverage

# Mutation testing
npm run test:mutation

# View mutation report (after running mutation tests)
open mutation-report.html
```

## Interactive API Documentation

**Open Swagger UI in your browser:**
```
http://localhost:3000/api-docs
```

You'll get a beautiful interactive interface (like Spring Boot Swagger UI) where you can:
- View all endpoints with detailed documentation
- Test API directly from the browser
- See request/response schemas
- Try different parameters and filters

**This is the easiest way to test the API!**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/invoices` | Create an invoice |
| `GET` | `/api/invoices` | List invoices (with filters) |
| `GET` | `/api/invoices/:id` | Get an invoice |
| `PATCH` | `/api/invoices/:id/pay` | Mark invoice as paid |
| `GET` | `/api/invoices/revenue` | Calculate revenue for a period |
| `GET` | `/health` | Health check |

## Architecture

```
src/
├── domain/                      # Business logic core (independent)
│   ├── entities/               # Business entities
│   ├── valueObjects/           # Value Objects
│   ├── services/               # Domain services
│   └── repositories/           # Ports (interfaces)
├── application/                # Use cases
│   └── usecases/
├── infrastructure/             # Adapters
│   ├── repositories/           # In-memory implementations
│   └── http/                   # REST API (Express)
└── index.js                    # Entry point
```

### Hexagonal Architecture Principles

- **Domain Layer**: Pure business logic, no dependencies on external frameworks
- **Application Layer**: Use cases orchestrating domain logic
- **Infrastructure Layer**: Technical implementations (database, HTTP, etc.)
- **Dependency Rule**: Dependencies point inward (Infrastructure → Application → Domain)
- **Ports & Adapters**: Domain defines ports (interfaces), Infrastructure provides adapters (implementations)

## Business Rules

- **Invoice number**: Format `INV-YYYY-XXX` (auto-generated)
- **Status**: `DRAFT` (default) → `PAID`
- **VAT rates**: 0%, 5.5%, 10% or 20%
- **Validation**: Minimum 1 line, quantity > 0, price > 0
- **Calculations**: Totals (excluding tax, VAT, including tax) automatically calculated

## Tests

Tests organized in 3 levels:

- **Unit tests** (domain + application): Pure business logic
- **Integration tests**: Repositories
- **E2E tests**: Complete API with supertest

## Manual Testing

See [MANUAL_TESTING.md](./MANUAL_TESTING.md) for:
- Complete test scenario with Swagger UI (recommended)
- Alternative cURL commands
- Error testing examples

## Project Structure

```
.
├── src/
│   ├── domain/                 # Core business logic
│   ├── application/            # Use cases
│   └── infrastructure/         # Technical adapters
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── README.md
├── MANUAL_TESTING.md
└── package.json
```

## Key Features

- **Hexagonal Architecture** - Clean separation of concerns
- **High test coverage** - Unit, integration and E2E tests
- **Swagger documentation** - Interactive API testing
- **In-memory storage** - Fast and simple for demos
- **Business logic isolation** - Easy to swap implementations
- **Full validation** - Input validation and business rules
- **RESTful API** - Standard HTTP methods and status codes

## Notes

- All data is stored **in-memory** and will be lost on server restart
- Only test clients are recreated automatically at startup
- To add persistence (SQLite, PostgreSQL, etc.), simply create a new adapter implementing the repository interfaces
- Thanks to hexagonal architecture, no changes needed in domain or application layers!
