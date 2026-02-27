import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';
import { ApiResponse, Todo } from '../types/todo.types';
import { CreateTodoInput, UpdateTodoInput } from '../schemas/todo.schema';

export class TodoController {
  constructor(private readonly service: TodoService) {}

  getAll = async (
    _req: Request,
    res: Response<ApiResponse<Todo[]>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todos = await this.service.getAllTodos();
      res.status(200).json({ success: true, data: todos });
    } catch (err) {
      next(err);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Todo>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.getTodoById(req.params.id);
      res.status(200).json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  };

  create = async (
    req: Request<Record<string, never>, ApiResponse<Todo>, CreateTodoInput>,
    res: Response<ApiResponse<Todo>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.createTodo(req.body);
      res.status(201).json({ success: true, data: todo, message: 'Todo created successfully' });
    } catch (err) {
      next(err);
    }
  };

  update = async (
    req: Request<{ id: string }, ApiResponse<Todo>, UpdateTodoInput>,
    res: Response<ApiResponse<Todo>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.updateTodo(req.params.id, req.body);
      res.status(200).json({ success: true, data: todo, message: 'Todo updated successfully' });
    } catch (err) {
      next(err);
    }
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<never>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.service.deleteTodo(req.params.id);
      res.status(200).json({ success: true, message: 'Todo deleted successfully' });
    } catch (err) {
      next(err);
    }
  };
}
