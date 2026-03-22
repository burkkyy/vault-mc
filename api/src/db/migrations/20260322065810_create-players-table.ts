import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("players", function (table) {
    table.uuid("uuid").notNullable().primary()

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("deleted_at").nullable()
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("players")
}
