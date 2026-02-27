import express, { Application } from 'express';
import todoRoutes from './routes/todo.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';

export function createApp(): Application {
  const app = express();

  // ── Body parsing ──────────────────────────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── Health check ──────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
  });

  // ── API routes ────────────────────────────────────────────────────────────
  app.use('/api/todos', todoRoutes);

  // ── 404 handler (must come after all routes) ──────────────────────────────
  app.use(notFoundHandler);

  // ── Global error handler (must be last, 4-arg signature) ──────────────────
  app.use(errorHandler);

  return app;
}
