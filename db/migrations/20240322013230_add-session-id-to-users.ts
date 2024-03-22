import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    //some dbs support .after() and some dont
    //index() to create and index because we will use a lot the session_id
    //so we can create a cache of it to load faster
    table.uuid('session_id').after('id').index();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('session_id');
  });
}

