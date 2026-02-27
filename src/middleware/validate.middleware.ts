import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '../types/todo.types';

type ValidationTarget = 'body' | 'params' | 'query';

export function validate(
  schema: ZodSchema,
  target: ValidationTarget = 'body'
) {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const zodError = result.error as ZodError;
      const messages = zodError.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages,
      });
      return;
    }
    req[target] = result.data;
    next();
  };
}
