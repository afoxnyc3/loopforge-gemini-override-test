export type TodoStatus = 'pending' | 'in_progress' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TodoStatus;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
