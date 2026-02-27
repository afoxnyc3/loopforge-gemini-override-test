import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo.types';

export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(dto: CreateTodoDTO): Promise<Todo>;
  update(id: string, dto: UpdateTodoDTO): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}
