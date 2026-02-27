import { z } from 'zod';

const todoStatusSchema = z.enum(['pending', 'in_progress', 'completed']);

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or fewer')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or fewer')
    .trim()
    .optional(),
  status: todoStatusSchema.optional().default('pending'),
});

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be 200 characters or fewer')
      .trim()
      .optional(),
    description: z
      .string()
      .max(1000, 'Description must be 1000 characters or fewer')
      .trim()
      .optional(),
    status: todoStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const todoIdSchema = z.object({
  id: z.string().uuid('Invalid todo ID format'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoIdParam = z.infer<typeof todoIdSchema>;
