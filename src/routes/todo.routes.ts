import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo.service';
import { InMemoryTodoRepository } from '../repositories/InMemoryTodoRepository';
import { validate } from '../middleware/validate.middleware';
import {
  createTodoSchema,
  updateTodoSchema,
  todoIdParamSchema,
} from '../schemas/todo.schema';

const repository = new InMemoryTodoRepository();
const service = new TodoService(repository);
const controller = new TodoController(service);

export const todoRoutes = Router();

todoRoutes.get('/', controller.getAll);

todoRoutes.get(
  '/:id',
  validate({ params: todoIdParamSchema }),
  controller.getById
);

todoRoutes.post(
  '/',
  validate({ body: createTodoSchema }),
  controller.create
);

todoRoutes.put(
  '/:id',
  validate({ params: todoIdParamSchema, body: updateTodoSchema }),
  controller.update
);

todoRoutes.delete(
  '/:id',
  validate({ params: todoIdParamSchema }),
  controller.delete
);
