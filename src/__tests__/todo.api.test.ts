import request from 'supertest';
import { createApp } from '../app';
import { Application } from 'express';

let app: Application;

beforeEach(() => {
  // Fresh app (and therefore fresh in-memory store) for each test
  app = createApp();
});

describe('GET /api/todos', () => {
  it('returns 200 with an empty array initially', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('POST /api/todos', () => {
  it('creates a todo and returns 201', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Buy groceries', description: 'Milk, eggs, bread' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
      completed: false,
      status: 'pending',
    });
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ description: 'No title here' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 when title is empty string', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/todos/:id', () => {
  it('returns 200 with the todo when found', async () => {
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Test todo' });
    const id = createRes.body.data.id;

    const res = await request(app).get(`/api/todos/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(id);
  });

  it('returns 404 when todo does not exist', async () => {
    const res = await request(app).get(
      '/api/todos/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for invalid UUID', async () => {
    const res = await request(app).get('/api/todos/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /api/todos/:id', () => {
  it('updates a todo and returns 200', async () => {
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Original title' });
    const id = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/todos/${id}`)
      .send({ title: 'Updated title', completed: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated title');
    expect(res.body.data.completed).toBe(true);
    expect(res.body.data.status).toBe('completed');
  });

  it('returns 404 when todo does not exist', async () => {
    const res = await request(app)
      .put('/api/todos/00000000-0000-0000-0000-000000000000')
      .send({ title: 'Ghost update' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when body is empty', async () => {
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Some todo' });
    const id = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/todos/${id}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/todos/:id', () => {
  it('deletes a todo and returns 200', async () => {
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'To be deleted' });
    const id = createRes.body.data.id;

    const res = await request(app).delete(`/api/todos/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Todo deleted successfully');
  });

  it('returns 404 when todo does not exist', async () => {
    const res = await request(app).delete(
      '/api/todos/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for invalid UUID', async () => {
    const res = await request(app).delete('/api/todos/bad-id');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Health check', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Unknown routes', () => {
  it('returns 404 for unregistered routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
