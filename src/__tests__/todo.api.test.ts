import request from 'supertest';
import { app } from '../app';

describe('Todo API', () => {
  let createdTodoId: string;

  // ── POST /api/todos ─────────────────────────────────────────────
  describe('POST /api/todos', () => {
    it('should create a new todo with title only', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Test todo' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('Test todo');
      expect(res.body.data.description).toBeNull();
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');

      createdTodoId = res.body.data.id;
    });

    it('should create a new todo with title and description', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Another todo', description: 'With a description' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Another todo');
      expect(res.body.data.description).toBe('With a description');
    });

    it('should return 400 for missing title', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ description: 'No title' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });

    it('should return 400 for empty body', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
      expect(res.body.details).toBeDefined();
    });
  });

  // ── GET /api/todos ──────────────────────────────────────────────
  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      const res = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── GET /api/todos/:id ──────────────────────────────────────────
  describe('GET /api/todos/:id', () => {
    it('should return a single todo by id', async () => {
      const res = await request(app)
        .get(`/api/todos/${createdTodoId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdTodoId);
    });

    it('should return 404 for non-existent id', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/todos/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });

    it('should return 400 for invalid UUID format', async () => {
      const res = await request(app)
        .get('/api/todos/not-a-valid-uuid')
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  // ── PUT /api/todos/:id ──────────────────────────────────────────
  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const res = await request(app)
        .put(`/api/todos/${createdTodoId}`)
        .send({ title: 'Updated todo', completed: true })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated todo');
      expect(res.body.data.completed).toBe(true);
    });

    it('should update updatedAt timestamp on partial update', async () => {
      const getBefore = await request(app)
        .get(`/api/todos/${createdTodoId}`)
        .expect(200);

      const previousUpdatedAt = getBefore.body.data.updatedAt;

      // Small delay to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const res = await request(app)
        .put(`/api/todos/${createdTodoId}`)
        .send({ title: 'Timestamp check' })
        .expect(200);

      expect(res.body.data.updatedAt).not.toBe(previousUpdatedAt);
    });

    it('should return 404 when updating non-existent todo', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .put(`/api/todos/${fakeId}`)
        .send({ title: 'Ghost update' })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });

    it('should return 400 for invalid UUID format on update', async () => {
      const res = await request(app)
        .put('/api/todos/bad-id')
        .send({ title: 'Bad id' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  // ── DELETE /api/todos/:id ───────────────────────────────────────
  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      await request(app)
        .delete(`/api/todos/${createdTodoId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent todo', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .delete(`/api/todos/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });

    it('should return 404 when deleting already-deleted todo', async () => {
      const res = await request(app)
        .delete(`/api/todos/${createdTodoId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });
  });

  // ── 404 Catch-All ───────────────────────────────────────────────
  describe('404 Catch-All', () => {
    it('should return JSON 404 for unmatched routes', async () => {
      const res = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
      expect(res.body.message).toContain('/api/nonexistent');
    });
  });
});
