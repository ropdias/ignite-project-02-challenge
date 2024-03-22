import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users');
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.timestamp('date_and_time').notNullable();
    table.boolean('was_on_daily_diet').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
