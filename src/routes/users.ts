import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/session', async (request, reply) => {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
    });

    const { email } = authenticateBodySchema.parse(request.body);

    const user = await knex('users').where('email', email).first();

    if (!user) {
      return reply.status(401).send({
        error: 'Unauthorized.',
      });
    }

    const sessionId = randomUUID();

    await knex('users').where('email', email).update('session_id', sessionId);

    // Save a cookie with the name 'sessionId':
    return reply
      .cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .status(200)
      .send();
  });

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { name, email } = createUserBodySchema.parse(request.body);

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
    });

    return reply.status(201).send();
  });

 
}
