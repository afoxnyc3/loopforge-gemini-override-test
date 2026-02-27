import { ITodoRepository } from '../interfaces/ITodoRepository';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo.types';
import { NotFoundError } from '../errors/AppError';

export class TodoService {
  constructor(private readonly repository: ITodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.repository.findAll();
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo = await this.repository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo');
    }
    return todo;
  }

  async createTodo(dto: CreateTodoDTO): Promise<Todo> {
    return this.repository.create(dto);
  }

  async updateTodo(id: string, dto: UpdateTodoDTO): Promise<Todo> {
    const todo = await this.repository.update(id, dto);
    if (!todo) {
      throw new NotFoundError('Todo');
    }
    return todo;
  }

  async deleteTodo(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Todo');
    }
  }
}
