import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("accounts", function (table) {
    table.increments("id").notNullable().primary()

    table.uuid("owner_uuid").notNullable()
    table.string("owner_type", 128).notNullable()
    table.bigInteger("balance").notNullable().defaultTo(0)

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("deleted_at").nullable()
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("accounts")
}
