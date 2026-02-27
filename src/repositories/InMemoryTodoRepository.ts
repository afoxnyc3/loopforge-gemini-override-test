import { v4 as uuidv4 } from 'uuid';
import { ITodoRepository } from '../interfaces/ITodoRepository';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo.types';

export class InMemoryTodoRepository implements ITodoRepository {
  private readonly store: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<Todo | null> {
    return this.store.get(id) ?? null;
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      completed: false,
      status: input.status ?? 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(todo.id, todo);
    return todo;
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;

    const updated: Todo = {
      ...existing,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.completed !== undefined && { completed: input.completed }),
      ...(input.status !== undefined && { status: input.status }),
      updatedAt: new Date(),
    };

    // If completed flag is set to true, sync status
    if (input.completed === true && updated.status !== 'completed') {
      updated.status = 'completed';
    }
    // If status is set to completed, sync completed flag
    if (input.status === 'completed' && !updated.completed) {
      updated.completed = true;
    }

    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
