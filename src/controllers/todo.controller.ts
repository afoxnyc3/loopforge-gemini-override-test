import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';
import { ApiResponse, Todo } from '../types/todo.types';
import { CreateTodoDto, UpdateTodoDto } from '../schemas/todo.schema';

export class TodoController {
  constructor(private readonly service: TodoService) {}

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todos = await this.service.getAllTodos();
      const response: ApiResponse<Todo[]> = {
        success: true,
        data: todos,
        message: `Retrieved ${todos.length} todo(s)`,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.getTodoById(req.params.id);
      const response: ApiResponse<Todo> = {
        success: true,
        data: todo,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  create = async (
    req: Request<Record<string, never>, unknown, CreateTodoDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.createTodo(req.body);
      const response: ApiResponse<Todo> = {
        success: true,
        data: todo,
        message: 'Todo created successfully',
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  update = async (
    req: Request<{ id: string }, unknown, UpdateTodoDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.updateTodo(req.params.id, req.body);
      const response: ApiResponse<Todo> = {
        success: true,
        data: todo,
        message: 'Todo updated successfully',
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.service.deleteTodo(req.params.id);
      const response: ApiResponse = {
        success: true,
        message: 'Todo deleted successfully',
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
