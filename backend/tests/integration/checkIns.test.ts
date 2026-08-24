import request from 'supertest';
import { app } from '../../src/index';
import '../../tests/setup';

describe('Check-In Integration Tests', () => {
  let userToken: string;
  let userId: number;
  let habitId: number;
  const userTimezone = 'Asia/Kolkata';

  beforeEach(async () => {
    // Sign up user
    const signupRes = await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'password123',
      timezone: userTimezone,
    });

    userToken = signupRes.body.token;
    userId = signupRes.body.user.id;

    // Create a habit
    const habitRes = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Daily Exercise',
        description: 'Morning 30-min workout',
      });

    habitId = habitRes.body.id;
  });

  describe('POST /api/habits/:id/check-ins', () => {
    test('Create check-in for today should return 201', async () => {
      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('local_date');
    });

    test('Duplicate check-in on same day should return 409', async () => {
      // First check-in
      await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      // Second check-in on same day
      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('Already checked in');
    });

    test('Future date should return 400', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ date: tomorrowStr });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('future date');
    });

    test('Date before habit creation should return 400', async () => {
      const farPast = '2020-01-01';
      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ date: farPast });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('before the habit was created');
    });

    test('Backfill past date should return 201', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ date: yesterdayStr });

      expect(res.status).toBe(201);
      expect(res.body.local_date).toBe(yesterdayStr);
    });

    test('Non-existent habit should return 404', async () => {
      const res = await request(app)
        .post('/api/habits/999999/check-ins')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('not found');
    });

    test('Check-in on another user\'s habit should return 403', async () => {
      // Sign up second user
      const user2Res = await request(app).post('/api/auth/signup').send({
        email: 'test2@example.com',
        password: 'password456',
        timezone: 'America/New_York',
      });

      const user2Token = user2Res.body.token;

      // Try to check in on first user's habit
      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('do not own');
    });

    test('Missing authentication should return 401', async () => {
      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .send({});

      expect(res.status).toBe(401);
    });

    test('Invalid date format should return 400', async () => {
      const res = await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ date: 'not-a-date' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('YYYY-MM-DD');
    });
  });

  describe('GET /api/habits/:id/check-ins', () => {
    beforeEach(async () => {
      // Add a few check-ins for testing
      await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});
    });

    test('Get check-ins for habit should return array', async () => {
      const res = await request(app)
        .get(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.checkIns).toBeInstanceOf(Array);
      expect(res.body.checkIns.length).toBeGreaterThan(0);
      expect(res.body.checkIns[0]).toHaveProperty('local_date');
    });

    test('Non-existent habit should return 404', async () => {
      const res = await request(app)
        .get('/api/habits/999999/check-ins')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    test('Another user cannot view habit check-ins', async () => {
      const user2Res = await request(app).post('/api/auth/signup').send({
        email: 'test2@example.com',
        password: 'password456',
        timezone: 'America/New_York',
      });

      const user2Token = user2Res.body.token;

      const res = await request(app)
        .get(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Streak computation after check-ins', () => {
    test('Worked example: check-ins on 10th, 11th, 12th should compute correct streaks', async () => {
      // We can't directly control "today" for the app, so we'll test with relative dates
      // Create check-ins for 3 consecutive days
      const today = new Date();
      const dates = [
        new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        today,
      ];

      for (const date of dates) {
        await request(app)
          .post(`/api/habits/${habitId}/check-ins`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ date: date.toISOString().split('T')[0] });
      }

      // Get habit to check streaks
      const res = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.streaks.currentStreak).toBe(3);
      expect(res.body.streaks.longestStreak).toBe(3);
    });

    test('Backfilling should recalculate streaks', async () => {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);

      // Create check-in for today
      await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ date: today.toISOString().split('T')[0] });

      // Check streaks before backfill
      let res = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.body.streaks.currentStreak).toBe(1);

      // Backfill yesterday
      await request(app)
        .post(`/api/habits/${habitId}/check-ins`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ date: yesterday.toISOString().split('T')[0] });

      // Check streaks after backfill
      res = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.body.streaks.currentStreak).toBe(2);
      expect(res.body.streaks.longestStreak).toBe(2);
    });
  });
});
