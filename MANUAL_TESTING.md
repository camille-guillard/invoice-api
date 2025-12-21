# Manual Testing Scenario

This document provides a complete manual testing scenario for the Invoice API.

## Prerequisites

- Server running on `http://localhost:3000`
- Two test clients automatically created at startup:
  - **Company A**: `client-1`
  - **Company B**: `client-2`

---

## Testing with Swagger UI

**Open in your browser:**
```
http://localhost:3000/api-docs
```

You'll see a beautiful interactive interface (same as Spring Boot Swagger UI) with all endpoints documented.

### Complete Test Scenario with Swagger

#### Step 1: Health Check

1. Click on **`GET /health`** under the **Health** section
2. Click **"Try it out"**
3. Click **"Execute"**
4. Expected: `{"status":"ok"}`

---

#### Step 2: Create an Invoice

1. Click on **`POST /api/invoices`** under the **Invoices** section
2. Click **"Try it out"**
3. Replace the request body with:
```json
{
  "clientId": "client-1",
  "lines": [
    {
      "description": "Web development service",
      "quantity": 10,
      "unitPrice": 500,
      "vatRate": 20
    },
    {
      "description": "Hosting service",
      "quantity": 1,
      "unitPrice": 100,
      "vatRate": 20
    }
  ]
}
```
4. Click **"Execute"**
5. Expected Response:
   - Status: `201 Created`
   - Invoice number: `INV-2025-001`
   - Status: `DRAFT`
   - Total excluding tax: `5100`
   - Total VAT: `1020`
   - Total including tax: `6120`

**Copy the `id` from the response for next steps!**

---

#### Step 3: Get Invoice by ID

1. Click on **`GET /api/invoices/{id}`**
2. Click **"Try it out"**
3. Paste the invoice ID in the **id** field
4. Click **"Execute"**
5. Expected: Same invoice details as step 2

---

#### Step 4: List All Invoices

1. Click on **`GET /api/invoices`**
2. Click **"Try it out"**
3. Leave all filters empty
4. Click **"Execute"**
5. Expected: Array with 1 invoice

---

#### Step 5: Filter Invoices by Status

1. Still on **`GET /api/invoices`**
2. In the **status** dropdown, select `DRAFT`
3. Click **"Execute"**
4. Expected: Only DRAFT invoices

---

#### Step 6: Mark Invoice as Paid

1. Click on **`PATCH /api/invoices/{id}/pay`**
2. Click **"Try it out"**
3. Paste the invoice ID
4. Click **"Execute"**
5. Expected:
   - Status: `200 OK`
   - Invoice status changed to `PAID`

---

#### Step 7: Create a Second Invoice (DRAFT)

1. Click on **`POST /api/invoices`**
2. Click **"Try it out"**
3. Use this body (with the second client ID):
```json
{
  "clientId": "client-2",
  "lines": [
    {
      "description": "Consulting",
      "quantity": 5,
      "unitPrice": 200,
      "vatRate": 20
    }
  ]
}
```
4. Click **"Execute"**
5. Expected:
   - Invoice number: `INV-2025-002`
   - Status: `DRAFT`
   - Total including tax: `1200`

---

#### Step 8: Filter Paid Invoices Only

1. Go back to **`GET /api/invoices`**
2. Click **"Try it out"**
3. Select `PAID` in the **status** dropdown
4. Click **"Execute"**
5. Expected: Only 1 invoice (the first one)

---

#### Step 9: Calculate Revenue

1. Click on **`GET /api/invoices/revenue`**
2. Click **"Try it out"**
3. Enter:
   - **startDate**: `2025-01-01`
   - **endDate**: `2025-12-31`
4. Click **"Execute"**
5. Expected:
```json
{
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "totalRevenue": 6120,
  "invoiceCount": 1
}
```

**Note:** Only PAID invoices are counted in revenue.

---

### Error Testing with Swagger

#### Test 1: Invalid Client ID

1. Go to **`POST /api/invoices`**
2. Click **"Try it out"**
3. Use `"clientId": "invalid-id"`
4. Click **"Execute"**
5. Expected: `400 Bad Request` - "Client not found"

---

#### Test 2: Invalid VAT Rate

1. Go to **`POST /api/invoices`**
2. Try using `"vatRate": 15` (invalid)
3. Expected: `400 Bad Request` - "VAT rate must be one of: 0, 5.5, 10, 20"

---

#### Test 3: Mark Already Paid Invoice

1. Go to **`PATCH /api/invoices/{id}/pay`**
2. Use the same invoice ID twice
3. Expected: `400 Bad Request` - "Invoice is already paid"

---

#### Test 4: Non-existent Invoice

1. Go to **`GET /api/invoices/{id}`**
2. Use a fake UUID
3. Expected: `404 Not Found` - "Invoice not found"

---

## Quick Access URLs

Once the server is running:

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **List Invoices**: http://localhost:3000/api/invoices

---

## Notes

- All data is stored **in-memory** and lost on server restart
- Only 2 test clients are recreated automatically
- Invoice numbers format: `INV-YYYY-XXX`
- Valid VAT rates: `0`, `5.5`, `10`, `20`
- **Use Swagger UI for interactive testing** - just like Spring Boot!
