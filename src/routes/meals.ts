import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date_and_time: z.string(),
        was_on_daily_diet: z.boolean(),
      });

      const { name, description, date_and_time, was_on_daily_diet } =
        createMealBodySchema.parse(request.body);

      const { sessionId } = request.cookies;

      const user = await knex('users').where('session_id', sessionId).first();

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      await knex('meals').insert({
        id: randomUUID(),
        user_id: user.id,
        name,
        description,
        date_and_time,
        was_on_daily_diet,
      });

      return reply.status(201).send();
    }
  );

  app.put(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const editMealBodySchema = z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string(),
        date_and_time: z.string(),
        was_on_daily_diet: z.boolean(),
      });

      const { id, name, description, date_and_time, was_on_daily_diet } =
        editMealBodySchema.parse(request.body);

      const { sessionId } = request.cookies;

      const user = await knex('users').where('session_id', sessionId).first();

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      const meal = await knex('meals').where('id', id).first();

      if (!meal) {
        return reply.status(404).send({
          error: 'Meal do not exist.',
        });
      }

      if (meal.user_id !== user.id) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      await knex('meals').where('id', id).update({
        name,
        description,
        date_and_time,
        was_on_daily_diet,
      });

      return reply.status(204).send();
    }
  );

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = deleteMealParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const user = await knex('users').where('session_id', sessionId).first();

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      const meal = await knex('meals').where('id', id).first();

      if (!meal) {
        return reply.status(404).send({
          error: 'Meal do not exist.',
        });
      }

      if (meal.user_id !== user.id) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      await knex('meals').where('id', id).del();

      return reply.status(204).send();
    }
  );

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const user = await knex('users').where('session_id', sessionId).first();

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      const meals = await knex('meals').where('user_id', user.id).select();

      return reply.status(200).send({ meals });
    }
  );

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const user = await knex('users').where('session_id', sessionId).first();

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      const meal = await knex('meals').where({ user_id: user.id, id }).first();

      return reply.status(200).send({ meal });
    }
  );

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const user = await knex('users').where('session_id', sessionId).first();

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      const meals = await knex('meals').where('user_id', user.id).select();

      totalNumberOfMeals = meals.length
      mealsInsideTheDailyDiet = 0
      mealsOutsideTheDailyDiet = 0
      betterSequenceInsideDailyDiet = 0
      currentSequenceInsideDailyDiet = 0

      meals.forEach((meal) => {
        if(meal.was_on_daily_diet) {
          mealsInsideTheDailyDiet++;
          currentSequenceInsideDailyDiet++;
        } else {
          mealsOutsideTheDailyDiet++;
          if (currentSequenceInsideDailyDiet > betterSequenceInsideDailyDiet) {
            betterSequenceInsideDailyDiet = currentSequenceInsideDailyDiet;
          }
          currentSequenceInsideDailyDiet = 0;
        }
      })
      
      return reply.status(200).send({ 
        totalNumberOfMeals,
        mealsInsideTheDailyDiet,
        mealsOutsideTheDailyDiet,
        betterSequenceInsideDailyDiet
      });
    }
  );
}
