import request from 'supertest';
import { app } from '../../src/index';
import '../../tests/setup';

describe('Habits Integration Tests', () => {
  let token1: string;
  let token2: string;
  let habitId: number;

  beforeEach(async () => {
    // Signup user 1
    const user1 = await request(app).post('/api/auth/signup').send({
      email: 'user1@example.com',
      password: 'password123',
      timezone: 'Asia/Kolkata',
    });
    token1 = user1.body.token;

    // Signup user 2
    const user2 = await request(app).post('/api/auth/signup').send({
      email: 'user2@example.com',
      password: 'password456',
      timezone: 'America/New_York',
    });
    token2 = user2.body.token;

    // Create a habit for user 1
    const habit = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Drink Water',
        description: 'Drink 3L of water daily',
      });
    habitId = habit.body.id;
  });

  describe('POST /api/habits', () => {
    test('Create habit with valid data should return 201', async () => {
      const res = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Read a Book',
          description: '10 pages of a book',
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        user_id: expect.any(Number),
        name: 'Read a Book',
        description: '10 pages of a book',
        created_at: expect.any(String),
      });
    });

    test('Create habit with missing name should return 400', async () => {
      const res = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          description: '10 pages of a book',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('name');
    });
  });

  describe('GET /api/habits', () => {
    test('Should return list of habits for authenticated user with streaks', async () => {
      const res = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.habits).toBeInstanceOf(Array);
      expect(res.body.habits.length).toBe(1);
      expect(res.body.habits[0]).toHaveProperty('name', 'Drink Water');
      expect(res.body.habits[0]).toHaveProperty('description', 'Drink 3L of water daily');
      expect(res.body.habits[0]).toHaveProperty('streaks');
      expect(res.body.habits[0]).toHaveProperty('checkedInToday');
    });

    test('Should return empty list for user with no habits', async () => {
      const res = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(200);
      expect(res.body.habits).toEqual([]);
    });
  });

  describe('GET /api/habits/:id', () => {
    test('Get detail of own habit should return 200 with detail', async () => {
      const res = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Drink Water');
      expect(res.body).toHaveProperty('checkIns');
      expect(res.body).toHaveProperty('streaks');
    });

    test('Get detail of another user\'s habit should return 403', async () => {
      const res = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(403);
    });

    test('Get non-existent habit should return 404', async () => {
      const res = await request(app)
        .get('/api/habits/999999')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/habits/:id', () => {
    test('Update own habit should return 200 with updated habit', async () => {
      const res = await request(app)
        .put(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Drink More Water',
          description: 'Drink 4L of water daily',
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Drink More Water');
      expect(res.body.description).toBe('Drink 4L of water daily');
    });

    test('Update another user\'s habit should return 403', async () => {
      const res = await request(app)
        .put(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          name: 'Drink More Water',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/habits/:id', () => {
    test('Delete own habit should return 204', async () => {
      const res = await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(204);

      // Verify deletion
      const check = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(check.status).toBe(404);
    });

    test('Delete another user\'s habit should return 403', async () => {
      const res = await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(403);
    });
  });
});
