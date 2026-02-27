import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo.service';
import { InMemoryTodoRepository } from '../repositories/InMemoryTodoRepository';
import { validate } from '../middleware/validate.middleware';
import { createTodoSchema, updateTodoSchema, todoIdSchema } from '../schemas/todo.schema';

const router = Router();

// Dependency injection wiring
const repository = new InMemoryTodoRepository();
const service = new TodoService(repository);
const controller = new TodoController(service);

// GET /api/todos
router.get('/', controller.getAll);

// GET /api/todos/:id
router.get(
  '/:id',
  validate(todoIdSchema, 'params'),
  controller.getById
);

// POST /api/todos
router.post(
  '/',
  validate(createTodoSchema, 'body'),
  controller.create
);

// PATCH /api/todos/:id
router.patch(
  '/:id',
  validate(todoIdSchema, 'params'),
  validate(updateTodoSchema, 'body'),
  controller.update
);

// DELETE /api/todos/:id
router.delete(
  '/:id',
  validate(todoIdSchema, 'params'),
  controller.delete
);

export default router;
