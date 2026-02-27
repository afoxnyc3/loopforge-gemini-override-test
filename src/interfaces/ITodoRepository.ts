import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo.types';

export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(input: CreateTodoInput): Promise<Todo>;
  update(id: string, input: UpdateTodoInput): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}
