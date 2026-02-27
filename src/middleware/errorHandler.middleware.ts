import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ApiResponse } from '../types/todo.types';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Operational errors we raised intentionally
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Unknown / programmer errors — don't leak internals
  console.error('[Unhandled Error]', err);

  const response: ApiResponse = {
    success: false,
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development' ? err.message : undefined,
  };

  res.status(500).json(response);
}

export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const response: ApiResponse = {
    success: false,
    error: `Route '${req.method} ${req.originalUrl}' not found`,
  };
  res.status(404).json(response);
}
