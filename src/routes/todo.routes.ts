import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo.service';
import { InMemoryTodoRepository } from '../repositories/InMemoryTodoRepository';
import { validate } from '../middleware/validate.middleware';
import {
  CreateTodoSchema,
  UpdateTodoSchema,
  UuidParamSchema,
} from '../schemas/todo.schema';

const router = Router();

// Dependency injection — wire up the chain
const repository = new InMemoryTodoRepository();
const service = new TodoService(repository);
const controller = new TodoController(service);

/**
 * GET /api/todos
 * Retrieve all todos
 */
router.get('/', controller.getAll);

/**
 * GET /api/todos/:id
 * Retrieve a single todo by ID
 */
router.get(
  '/:id',
  validate(UuidParamSchema, 'params'),
  controller.getById
);

/**
 * POST /api/todos
 * Create a new todo
 */
router.post(
  '/',
  validate(CreateTodoSchema, 'body'),
  controller.create
);

/**
 * PUT /api/todos/:id
 * Update an existing todo
 */
router.put(
  '/:id',
  validate(UuidParamSchema, 'params'),
  validate(UpdateTodoSchema, 'body'),
  controller.update
);

/**
 * DELETE /api/todos/:id
 * Delete a todo
 */
router.delete(
  '/:id',
  validate(UuidParamSchema, 'params'),
  controller.delete
);

export default router;
