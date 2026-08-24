import request from 'supertest';
import { app } from '../../src/index';
import '../../tests/setup';

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/signup', () => {
    test('Valid signup should return 201 with token', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        timezone: 'Asia/Kolkata',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toEqual({
        id: expect.any(Number),
        email: 'test@example.com',
        timezone: 'Asia/Kolkata',
      });
    });

    test('Signup with invalid timezone should return 400', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        timezone: 'Invalid/Timezone',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid timezone');
    });

    test('Duplicate email should return 409', async () => {
      // First signup
      await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        timezone: 'Asia/Kolkata',
      });

      // Second signup with same email
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password456',
        timezone: 'America/New_York',
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already registered');
    });

    test('Invalid email format should return 400', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'not-an-email',
        password: 'password123',
        timezone: 'Asia/Kolkata',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('email');
    });

    test('Password too short should return 400', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'short',
        timezone: 'Asia/Kolkata',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        timezone: 'Asia/Kolkata',
      });
    });

    test('Valid login should return 200 with token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    test('Wrong password should return 401', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid email or password');
    });

    test('Non-existent email should return 401', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        timezone: 'Asia/Kolkata',
      });
      token = res.body.token;
    });

    test('Valid token should return 200 with user data', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual({
        id: expect.any(Number),
        email: 'test@example.com',
        timezone: 'Asia/Kolkata',
      });
    });

    test('Missing token should return 401', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Authentication required');
    });

    test('Invalid token should return 401', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid or expired token');
    });
  });
});
