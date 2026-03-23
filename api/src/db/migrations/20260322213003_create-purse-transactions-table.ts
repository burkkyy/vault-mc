import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("purse_transactions", function (table) {
    table.increments("id").notNullable().primary()

    table.uuid("player_uuid").notNullable()
    table.integer("account_id").notNullable()
    table.string("transaction_type", 128).notNullable()
    table.string("transaction_source", 128).notNullable()
    table.integer("amount").notNullable()
    table.string("note", 255).nullable()

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("deleted_at").nullable()

    table.foreign("player_uuid").references("players.uuid")
    table.foreign("account_id").references("accounts.id")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("purse_transactions")
}
