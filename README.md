# Todo REST API

A production-quality Express.js + TypeScript REST API for managing todos.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4
- **Language**: TypeScript 5
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **ID generation**: uuid v4

## Architecture

```
src/
├── types/          # TypeScript interfaces and DTOs
├── interfaces/     # Repository contracts
├── schemas/        # Zod validation schemas
├── errors/         # Custom error classes
├── repositories/   # Data access layer (in-memory)
├── services/       # Business logic layer
├── controllers/    # HTTP request handlers
├── middleware/     # Validation & error handling
├── routes/         # Express route definitions
├── app.ts          # App factory
└── server.ts       # Entry point
```

## Getting Started

```bash
npm install
npm run dev      # Development with hot-reload
npm run build    # Compile TypeScript
npm start        # Run compiled output
npm test         # Run test suite
npm run test:coverage  # Run tests with coverage
```

## API Endpoints

All responses follow the envelope: `{ success, data?, error?, message? }`

| Method | Path             | Description        |
|--------|------------------|--------------------|  
| GET    | /api/todos       | List all todos     |
| GET    | /api/todos/:id   | Get todo by ID     |
| POST   | /api/todos       | Create a todo      |
| PATCH  | /api/todos/:id   | Update a todo      |
| DELETE | /api/todos/:id   | Delete a todo      |
| GET    | /health          | Health check       |

## Request / Response Examples

### Create Todo
```json
POST /api/todos
{ "title": "Buy groceries", "description": "Milk, eggs", "status": "pending" }

201 Created
{ "success": true, "data": { "id": "uuid", "title": "Buy groceries", ... }, "message": "Todo created successfully" }
```

### Update Todo
```json
PATCH /api/todos/:id
{ "status": "completed" }

200 OK
{ "success": true, "data": { ... }, "message": "Todo updated successfully" }
```

### Error Response
```json
{ "success": false, "error": "Todo not found" }
```

## Todo Schema

| Field       | Type                                   | Required |
|-------------|----------------------------------------|----------|
| id          | UUID string                            | auto     |
| title       | string (1–200 chars)                   | yes      |
| description | string (max 1000 chars)                | no       |
| status      | pending \| in_progress \| completed    | no (default: pending) |
| createdAt   | ISO datetime                           | auto     |
| updatedAt   | ISO datetime                           | auto     |
