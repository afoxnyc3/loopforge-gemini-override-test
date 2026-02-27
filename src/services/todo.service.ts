import { ITodoRepository } from '../interfaces/ITodoRepository';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo.types';
import { NotFoundError } from '../errors/AppError';

export class TodoService {
  constructor(private readonly repository: ITodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.repository.findAll();
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo = await this.repository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo', id);
    }
    return todo;
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    return this.repository.create(input);
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new NotFoundError('Todo', id);
    }
    return updated;
  }

  async deleteTodo(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Todo', id);
    }
  }
}
