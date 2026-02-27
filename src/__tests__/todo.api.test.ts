import request from 'supertest';
import { createApp } from '../app';
import { Application } from 'express';

let app: Application;

beforeAll(() => {
  app = createApp();
});

describe('GET /health', () => {
  it('returns 200 with ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Todo CRUD API', () => {
  let createdId: string;

  describe('POST /api/todos', () => {
    it('creates a todo with valid body', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Buy groceries', description: 'Milk, eggs, bread' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        title: 'Buy groceries',
        description: 'Milk, eggs, bread',
        status: 'pending',
      });
      expect(res.body.data.id).toBeDefined();
      createdId = res.body.data.id;
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app).post('/api/todos').send({ description: 'No title' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });

    it('returns 400 when title is empty string', async () => {
      const res = await request(app).post('/api/todos').send({ title: '' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when status is invalid', async () => {
      const res = await request(app).post('/api/todos').send({ title: 'Test', status: 'done' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/todos', () => {
    it('returns array of todos', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/todos/:id', () => {
    it('returns a specific todo by id', async () => {
      const res = await request(app).get(`/api/todos/${createdId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdId);
    });

    it('returns 404 for non-existent id', async () => {
      const res = await request(app).get('/api/todos/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 for invalid UUID format', async () => {
      const res = await request(app).get('/api/todos/not-a-uuid');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('updates a todo successfully', async () => {
      const res = await request(app)
        .patch(`/api/todos/${createdId}`)
        .send({ status: 'in_progress', title: 'Buy groceries (updated)' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('in_progress');
      expect(res.body.data.title).toBe('Buy groceries (updated)');
    });

    it('returns 400 for empty update body', async () => {
      const res = await request(app).patch(`/api/todos/${createdId}`).send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 404 for non-existent id', async () => {
      const res = await request(app)
        .patch('/api/todos/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Ghost' });
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes a todo successfully', async () => {
      const res = await request(app).delete(`/api/todos/${createdId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Todo deleted successfully');
    });

    it('returns 404 after deletion', async () => {
      const res = await request(app).get(`/api/todos/${createdId}`);
      expect(res.status).toBe(404);
    });

    it('returns 404 for non-existent id on delete', async () => {
      const res = await request(app).delete('/api/todos/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('404 for unknown routes', () => {
    it('returns 404 for unregistered route', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
