import express, { Request, Response } from 'express';
import { todoRoutes } from './routes/todo.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

export const app = express();

// Body parsing
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// 404 catch-all for unmatched routes — must come after all route registrations
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${_req.method} ${_req.originalUrl} not found`,
  });
});

// Global error handler — must be last middleware
app.use(errorHandler);
