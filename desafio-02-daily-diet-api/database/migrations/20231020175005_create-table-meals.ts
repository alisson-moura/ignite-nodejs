import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable()
    table.string('name').notNullable()
    table.string('description')
    table.boolean('diet_status').notNullable()
    table.string('created_at').defaultTo(knex.fn.now())

    table.foreign('user_id').references('users.id')
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', table => {
    table.dropForeign('user_id')
  })

  await knex.schema.dropTable('meals')
}
