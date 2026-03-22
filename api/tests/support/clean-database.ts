import { QueryTypes } from "@sequelize/core"

import { isNil } from "lodash"

import db from "@/db/db-client"

async function getTableNames() {
  const query = /* sql */ `
    SELECT
      table_name as "tableName"
    FROM
      information_schema.tables
    WHERE
      table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name != 'SequelizeMeta'
      AND table_name != 'knex_migrations'
      AND table_name != 'knex_migrations_lock';
  `

  try {
    const result = await db.query<{ tableName: string }>(query, { type: QueryTypes.SELECT })
    const tableNames = result.map((row) => row.tableName)
    return tableNames
  } catch (error) {
    console.error("Error fetching table names:", error)
    throw error
  }
}

async function buildCleanDatabaseQuery() {
  const tableNames = await getTableNames()
  const quotedTableNames = tableNames.map((name) => `"${name}"`)
  return /* sql */ `
    TRUNCATE TABLE ${quotedTableNames.join(",\n      ")} RESTART IDENTITY CASCADE;
  `
}

let cleanDatabaseQuery: string | null = null

export async function cleanDatabase() {
  if (isNil(cleanDatabaseQuery)) {
    cleanDatabaseQuery = await buildCleanDatabaseQuery()
  }

  try {
    await db.query(cleanDatabaseQuery, { raw: true })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export default cleanDatabase
