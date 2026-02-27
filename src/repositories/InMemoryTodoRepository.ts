import { v4 as uuidv4 } from 'uuid';
import { ITodoRepository } from '../interfaces/ITodoRepository';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo.types';

export class InMemoryTodoRepository implements ITodoRepository {
  private readonly store: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<Todo | null> {
    return this.store.get(id) ?? null;
  }

  async create(dto: CreateTodoDTO): Promise<Todo> {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(todo.id, todo);
    return todo;
  }

  async update(id: string, dto: UpdateTodoDTO): Promise<Todo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;

    const updated: Todo = {
      ...existing,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status !== undefined && { status: dto.status }),
      updatedAt: new Date(),
    };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  /** Test helper: clear all data */
  clear(): void {
    this.store.clear();
  }
}
