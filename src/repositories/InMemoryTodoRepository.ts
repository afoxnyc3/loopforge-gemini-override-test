import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo.types';
import { ITodoRepository } from '../interfaces/ITodoRepository';

export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) ?? null;
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: uuidv4(),
      title: input.title,
      description: input.description ?? null,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const existing = this.todos.get(id);
    if (!existing) {
      return null;
    }

    const updated: Todo = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.todos.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }
}
