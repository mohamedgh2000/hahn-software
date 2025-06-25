# Hahn Software CRUD API Documentation

## Overview

The Hahn Software Product Management API provides RESTful endpoints for managing products in the inventory system. All endpoints return JSON responses with a consistent structure.

## Base URL

```
http://localhost:8080/api
```

## Response Format

All API responses follow this consistent structure:

```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "errors": object (optional)
}
```

## Authentication

Currently, the API does not require authentication. In a production environment, consider implementing JWT or OAuth2 authentication.

## Endpoints

### 1. Get All Products

Retrieves a list of all products in the system.

**Endpoint:** `GET /products`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "description": "Premium wireless Bluetooth headphones with noise cancellation",
      "price": 149.99,
      "quantity": 50,
      "category": "Electronics",
      "createdAt": "2025-06-25T20:30:00",
      "updatedAt": "2025-06-25T20:30:00"
    }
  ],
  "message": "Products retrieved successfully"
}
```

### 2. Get Product by ID

Retrieves a specific product by its ID.

**Endpoint:** `GET /products/{id}`

**Parameters:**
- `id` (path parameter): Product ID (integer)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Bluetooth Headphones",
    "description": "Premium wireless Bluetooth headphones with noise cancellation",
    "price": 149.99,
    "quantity": 50,
    "category": "Electronics",
    "createdAt": "2025-06-25T20:30:00",
    "updatedAt": "2025-06-25T20:30:00"
  },
  "message": "Product retrieved successfully"
}
```

**Error Response (Product Not Found):**
```json
{
  "success": false,
  "message": "Product not found with id: 999"
}
```

### 3. Create Product

Creates a new product in the system.

**Endpoint:** `POST /products`

**Request Body:**
```json
{
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium wireless Bluetooth headphones with noise cancellation",
  "price": 149.99,
  "quantity": 50,
  "category": "Electronics"
}
```

**Validation Rules:**
- `name`: Required, 2-255 characters
- `description`: Optional, max 1000 characters
- `price`: Required, must be greater than 0, max 8 integer digits and 2 decimal places
- `quantity`: Required, must be >= 0
- `category`: Optional, max 100 characters

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Bluetooth Headphones",
    "description": "Premium wireless Bluetooth headphones with noise cancellation",
    "price": 149.99,
    "quantity": 50,
    "category": "Electronics",
    "createdAt": "2025-06-25T20:30:00",
    "updatedAt": "2025-06-25T20:30:00"
  },
  "message": "Product created successfully"
}
```

**Validation Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Product name is required",
    "price": "Price must be greater than 0"
  }
}
```

### 4. Update Product

Updates an existing product.

**Endpoint:** `PUT /products/{id}`

**Parameters:**
- `id` (path parameter): Product ID (integer)

**Request Body:**
```json
{
  "name": "Updated Wireless Bluetooth Headphones",
  "description": "Updated premium wireless Bluetooth headphones with noise cancellation",
  "price": 179.99,
  "quantity": 45,
  "category": "Electronics"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Wireless Bluetooth Headphones",
    "description": "Updated premium wireless Bluetooth headphones with noise cancellation",
    "price": 179.99,
    "quantity": 45,
    "category": "Electronics",
    "createdAt": "2025-06-25T20:30:00",
    "updatedAt": "2025-06-25T20:35:00"
  },
  "message": "Product updated successfully"
}
```

### 5. Delete Product

Deletes a product from the system.

**Endpoint:** `DELETE /products/{id}`

**Parameters:**
- `id` (path parameter): Product ID (integer)

**Success Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Response (Product Not Found):**
```json
{
  "success": false,
  "message": "Product not found with id: 999"
}
```

### 6. Search Products

Searches products by name or description.

**Endpoint:** `GET /products/search`

**Query Parameters:**
- `q` (optional): Search term to match against product name or description

**Example:** `GET /products/search?q=bluetooth`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "description": "Premium wireless Bluetooth headphones with noise cancellation",
      "price": 149.99,
      "quantity": 50,
      "category": "Electronics",
      "createdAt": "2025-06-25T20:30:00",
      "updatedAt": "2025-06-25T20:30:00"
    }
  ],
  "message": "Search completed successfully"
}
```

### 7. Get Products by Category

Retrieves products filtered by category.

**Endpoint:** `GET /products/category/{category}`

**Parameters:**
- `category` (path parameter): Category name (case-insensitive)

**Example:** `GET /products/category/Electronics`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "description": "Premium wireless Bluetooth headphones with noise cancellation",
      "price": 149.99,
      "quantity": 50,
      "category": "Electronics",
      "createdAt": "2025-06-25T20:30:00",
      "updatedAt": "2025-06-25T20:30:00"
    }
  ],
  "message": "Products retrieved successfully"
}
```

### 8. Get Low Stock Products

Retrieves products with quantity below or equal to a specified threshold.

**Endpoint:** `GET /products/low-stock`

**Query Parameters:**
- `threshold` (optional): Stock threshold (default: 10)

**Example:** `GET /products/low-stock?threshold=5`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "USB-C Cable",
      "description": "High-speed USB-C charging cable",
      "price": 19.99,
      "quantity": 3,
      "category": "Accessories",
      "createdAt": "2025-06-25T20:30:00",
      "updatedAt": "2025-06-25T20:30:00"
    }
  ],
  "message": "Low stock products retrieved successfully"
}
```

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Data Types

### Product Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Long | Auto-generated | Unique product identifier |
| name | String | Yes | Product name (2-255 characters) |
| description | String | No | Product description (max 1000 characters) |
| price | BigDecimal | Yes | Product price (must be > 0) |
| quantity | Integer | Yes | Stock quantity (must be >= 0) |
| category | String | No | Product category (max 100 characters) |
| createdAt | LocalDateTime | Auto-generated | Creation timestamp |
| updatedAt | LocalDateTime | Auto-generated | Last update timestamp |

## CORS Configuration

The API is configured to accept requests from any origin (`*`) for development purposes. In production, configure specific allowed origins for security.

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production environments.

## Examples

### cURL Examples

**Get all products:**
```bash
curl -X GET http://localhost:8080/api/products
```

**Create a product:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with precision tracking",
    "price": 29.99,
    "quantity": 100,
    "category": "Accessories"
  }'
```

**Update a product:**
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Wireless Mouse",
    "description": "Updated ergonomic wireless mouse with precision tracking",
    "price": 34.99,
    "quantity": 95,
    "category": "Accessories"
  }'
```

**Delete a product:**
```bash
curl -X DELETE http://localhost:8080/api/products/1
```

### JavaScript/Axios Examples

**Get all products:**
```javascript
const response = await axios.get('http://localhost:8080/api/products');
console.log(response.data);
```

**Create a product:**
```javascript
const newProduct = {
  name: 'Wireless Mouse',
  description: 'Ergonomic wireless mouse with precision tracking',
  price: 29.99,
  quantity: 100,
  category: 'Accessories'
};

const response = await axios.post('http://localhost:8080/api/products', newProduct);
console.log(response.data);
```

## Testing

Use tools like Postman, Insomnia, or cURL to test the API endpoints. A Postman collection is available in the repository for easy testing.

## Support

For API support and questions, please contact the Hahn Software development team.

