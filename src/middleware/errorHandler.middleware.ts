import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ApiResponse } from '../types/todo.types';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Unexpected / non-operational errors
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}

export function notFoundHandler(
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested route does not exist',
  });
}
