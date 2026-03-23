import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("transfers", function (table) {
    table.increments("id").notNullable().primary()

    table.integer("from_account_id").notNullable()
    table.integer("to_account_id").notNullable()
    table.integer("amount").notNullable()
    table.string("note", 255).nullable()

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("deleted_at").nullable()

    table.foreign("from_account_id").references("accounts.id")
    table.foreign("to_account_id").references("accounts.id")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("transfers")
}
