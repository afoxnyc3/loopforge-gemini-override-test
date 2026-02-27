import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '../types/todo.types';

type ValidationTarget = 'body' | 'params' | 'query';

export function validate(
  schema: ZodSchema,
  target: ValidationTarget = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const errorMessages = zodError.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');

      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: errorMessages,
      };

      res.status(400).json(response);
      return;
    }

    // Attach parsed (coerced/trimmed) data back to the request
    req[target] = result.data as typeof req[typeof target];
    next();
  };
}
