import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('Users routes', () => {
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

  it('should be able to create a new user', async () => {
    // passing the node server to the request from supertest
    await request(app.server)
      .post('/users')
      .send({
        name: 'Rodrigo P. Dias',
        email: 'rodrigo@test.com',
      })
      .expect(201);
  });

  it('should be able to authenticate', async () => {
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

    expect(cookies[0]).toContain('sessionId=');
  });

  it('should not be able to authenticate with an invalid email', async () => {
    await request(app.server)
      .post('/users/session')
      .send({
        email: 'rodrigo@test.com',
      })
      .expect(401);
  });
});
