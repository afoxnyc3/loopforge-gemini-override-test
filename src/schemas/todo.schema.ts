import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or fewer'),
  description: z
    .string()
    .max(1024, 'Description must be 1024 characters or fewer')
    .optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must not be empty')
    .max(255, 'Title must be 255 characters or fewer')
    .optional(),
  description: z
    .string()
    .max(1024, 'Description must be 1024 characters or fewer')
    .nullable()
    .optional(),
  completed: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export const todoIdParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
export type TodoIdParam = z.infer<typeof todoIdParamSchema>;
