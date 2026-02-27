# Todo REST API

A production-quality CRUD REST API for managing todos, built with **Express.js** and **TypeScript**.

## Features

- Full CRUD operations for todos
- Input validation with [Zod](https://zod.dev)
- Layered architecture: Routes → Controllers → Services → Repository
- Repository interface abstraction (swap in-memory for a real DB without touching business logic)
- Consistent JSON response envelope: `{ success, data?, error?, message? }`
- Custom `AppError` hierarchy with proper HTTP status codes
- UUID-based IDs
- Integration test suite with Jest + Supertest
- Graceful shutdown (SIGTERM / SIGINT)

## Quick Start

```bash
npm install
npm run dev        # development with hot-reload
npm run build      # compile TypeScript
npm start          # run compiled output
npm test           # run tests with coverage
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/todos` | List all todos |
| `GET` | `/api/todos/:id` | Get a single todo by UUID |
| `POST` | `/api/todos` | Create a new todo |
| `PUT` | `/api/todos/:id` | Update an existing todo |
| `DELETE` | `/api/todos/:id` | Delete a todo |
| `GET` | `/health` | Health check |

## Request / Response Examples

### Create a Todo
```http
POST /api/todos
Content-Type: application/json

{ "title": "Buy groceries", "description": "Milk, eggs, bread", "status": "pending" }
```

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "title: Title is required"
}
```

### Not Found
```json
{
  "success": false,
  "error": "Todo with id '...' not found"
}
```

## Project Structure

```
src/
├── __tests__/          # Integration tests
├── controllers/        # Request/response handling
├── errors/             # Custom error classes
├── interfaces/         # Repository interface
├── middleware/         # Validation + error handling
├── repositories/       # In-memory data store
├── routes/             # Express routers
├── schemas/            # Zod validation schemas
├── services/           # Business logic
├── types/              # TypeScript interfaces
├── app.ts              # Express app factory
└── server.ts           # HTTP server entry point
```

## Todo Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID) | Unique identifier |
| `title` | `string` (1–200 chars) | Required |
| `description` | `string` (≤1000 chars) | Optional |
| `completed` | `boolean` | Defaults to `false` |
| `status` | `'pending' \| 'in_progress' \| 'completed'` | Defaults to `'pending'` |
| `createdAt` | `Date` | Auto-set on creation |
| `updatedAt` | `Date` | Auto-updated on change |
