import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table
      .timestamp('updated_at')
      .defaultTo(knex.fn.now())
      .after('created_at')
      .notNullable();
  });

  await knex.schema.alterTable('meals', (table) => {
    table
      .timestamp('updated_at')
      .defaultTo(knex.fn.now())
      .after('created_at')
      .notNullable();
    table.renameColumn('was_on_daily_diet', 'is_on_daily_diet');
    table.renameColumn('date_and_time', 'date');
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .alter();
  });

  await knex.schema.alterTable('meals', (table) => {
    table.date('date').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('updated_at');
  });
  await knex.schema.alterTable('meals', (table) => {
    table.uuid('user_id').references('id').inTable('users').alter();
    table.renameColumn('date', 'date_and_time');
    table.renameColumn('is_on_daily_diet', 'was_on_daily_diet');
    table.dropColumn('updated_at');
  });
  await knex.schema.alterTable('meals', (table) => {
    table.timestamp('date').notNullable().alter();
  });
}
