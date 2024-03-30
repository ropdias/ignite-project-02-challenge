import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('Meals routes', () => {
  beforeAll(async () => {
    // Wait fastify to start the server with all plugins ready
    await app.ready();
  });

  afterAll(async () => {
    // Wait fastify to close the server
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all');
    execSync('npm run knex -- migrate:latest');
  });

  it('should not be able to create a new meal without a session', async () => {
    // passing the node server to the request from supertest
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Meal 1',
        description: 'This is meal 1',
        date_and_time: Date.now().toString(),
        was_on_daily_diet: true,
      })
      .expect(401);
  });

  it('should not be able to create a new meal without a valid session', async () => {
    await request(app.server)
      .post('/meals')
      .set('Cookie', ['sessionId=123'])
      .send({
        name: 'Meal 1',
        description: 'This is meal 1',
        date_and_time: Date.now().toString(),
        was_on_daily_diet: true,
      })
      .expect(401);
  });

  it('should be able to create a new meal ', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Rodrigo P. Dias',
        email: 'rodrigo@test.com',
      })
      .expect(201);

    const authenticateResponse = await request(app.server)
      .post('/users/session')
      .send({
        email: 'rodrigo@test.com',
      })
      .expect(200);

    const cookies = authenticateResponse.get('Set-Cookie');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'This is meal 1',
        date_and_time: Date.now().toString(),
        was_on_daily_diet: true,
      })
      .expect(201);
  });

  it('should be able to get all meals', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Rodrigo P. Dias',
        email: 'rodrigo@test.com',
      })
      .expect(201);

    const authenticateResponse = await request(app.server)
      .post('/users/session')
      .send({
        email: 'rodrigo@test.com',
      })
      .expect(200);

    const cookies = authenticateResponse.get('Set-Cookie');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'This is meal 1',
        date_and_time: Date.now().toString(),
        was_on_daily_diet: true,
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 2',
        description: 'This is meal 2',
        date_and_time: Date.now().toString(),
        was_on_daily_diet: false,
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    expect(mealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Meal 1',
        description: 'This is meal 1',
      }),
      expect.objectContaining({
        name: 'Meal 2',
        description: 'This is meal 2',
      }),
    ]);
  });

  it('should be able to get a specific meal', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Rodrigo P. Dias',
        email: 'rodrigo@test.com',
      })
      .expect(201);

    const authenticateResponse = await request(app.server)
      .post('/users/session')
      .send({
        email: 'rodrigo@test.com',
      })
      .expect(200);

    const cookies = authenticateResponse.get('Set-Cookie');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'This is meal 1',
        date_and_time: Date.now().toString(),
        was_on_daily_diet: true,
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Meal 1',
        description: 'This is meal 1',
      })
    );
  });

  it('should be able to delete a specific meal', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Rodrigo P. Dias',
        email: 'rodrigo@test.com',
      })
      .expect(201);

    const authenticateResponse = await request(app.server)
      .post('/users/session')
      .send({
        email: 'rodrigo@test.com',
      })
      .expect(200);

    const cookies = authenticateResponse.get('Set-Cookie');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'This is meal 1',
        date_and_time: Date.now().toString(),
        was_on_daily_diet: true,
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204);

    const mealsResponseAfterDelete = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    expect(mealsResponseAfterDelete.body.meals).toHaveLength(0);
  });

  // Make test to edit a meal
});
