import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';
import { CreateTodoInput, UpdateTodoInput } from '../types/todo.types';

export class TodoController {
  constructor(private todoService: TodoService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todos = await this.todoService.getAll();
      res.status(200).json({
        success: true,
        data: todos,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const todo = await this.todoService.getById(id);

      if (!todo) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Todo with id ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: CreateTodoInput = req.body;
      const todo = await this.todoService.create(input);
      res.status(201).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const input: UpdateTodoInput = req.body;
      const todo = await this.todoService.update(id, input);

      if (!todo) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Todo with id ${id} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.todoService.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Todo with id ${id} not found`,
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
