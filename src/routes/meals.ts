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
        date: z.coerce.date(),
        isOnDailyDiet: z.boolean(),
      });

      const { name, description, date, isOnDailyDiet } =
        createMealBodySchema.parse(request.body);

      await knex('meals').insert({
        id: randomUUID(),
        user_id: request.user?.id,
        name,
        description,
        date: date.getTime(),
        is_on_daily_diet: isOnDailyDiet,
      });

      return reply.status(201).send();
    }
  );

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const editMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = editMealParamsSchema.parse(request.params);

      const editMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        isOnDailyDiet: z.boolean(),
      });

      const { name, description, date, isOnDailyDiet } =
        editMealBodySchema.parse(request.body);

      const meal = await knex('meals').where('id', id).first();

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' });
      }

      if (meal.user_id !== request.user?.id) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        });
      }

      await knex('meals').where('id', id).update({
        name,
        description,
        date: date.getTime(),
        is_on_daily_diet: isOnDailyDiet,
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

      const meal = await knex('meals').where('id', id).first();

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' });
      }

      if (meal.user_id !== request.user?.id) {
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
      const meals = await knex('meals')
        .where('user_id', request.user?.id)
        .orderBy('date', 'desc');

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

      const meal = await knex('meals')
        .where({ user_id: request.user?.id, id })
        .first();

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' });
      }

      return reply.status(200).send({ meal });
    }
  );

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where('user_id', request.user?.id)
        .select();

      const totalNumberOfMeals = meals.length;
      let mealsInsideTheDailyDiet = 0;
      let mealsOutsideTheDailyDiet = 0;
      let betterSequenceInsideDailyDiet = 0;
      let currentSequenceInsideDailyDiet = 0;

      meals.forEach((meal) => {
        if (meal.is_on_daily_diet) {
          mealsInsideTheDailyDiet++;
          currentSequenceInsideDailyDiet++;
        } else {
          mealsOutsideTheDailyDiet++;
          if (currentSequenceInsideDailyDiet > betterSequenceInsideDailyDiet) {
            betterSequenceInsideDailyDiet = currentSequenceInsideDailyDiet;
          }
          currentSequenceInsideDailyDiet = 0;
        }
      });

      return reply.status(200).send({
        totalNumberOfMeals,
        mealsInsideTheDailyDiet,
        mealsOutsideTheDailyDiet,
        betterSequenceInsideDailyDiet,
      });
    }
  );
}
