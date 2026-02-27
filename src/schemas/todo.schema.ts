import { z } from 'zod';

export const TodoStatusSchema = z.enum(['pending', 'in_progress', 'completed']);

export const CreateTodoSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional(),
  status: TodoStatusSchema.optional().default('pending'),
});

export const UpdateTodoSchema = z
  .object({
    title: z
      .string({
        invalid_type_error: 'Title must be a string',
      })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters')
      .trim()
      .optional(),
    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .max(1000, 'Description cannot exceed 1000 characters')
      .trim()
      .optional(),
    completed: z
      .boolean({
        invalid_type_error: 'Completed must be a boolean',
      })
      .optional(),
    status: TodoStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const UuidParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format for id'),
});

export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoDto = z.infer<typeof UpdateTodoSchema>;
