import knex, { type Knex } from "knex"

import { DB_DATABASE, NODE_ENV } from "@/config"
import { buildKnexConfig } from "@/db/db-migration-client"
import logger from "@/utils/logger"

const dbConfig = buildKnexConfig() as Knex.Config & {
  connection: { user: string; database: string }
}

async function databaseExists(dbLegacy: Knex, databaseName: string): Promise<boolean> {
  const result = await dbLegacy.raw("SELECT 1 FROM pg_database WHERE datname = ?", [databaseName])

  return result.rows.length > 0
}

async function createDatabase(): Promise<void> {
  if (
    NODE_ENV === "production" &&
    process.env.PRODUCTION_DATABASE_SA_MASTER_CREDS_AVAILABLE !== "true"
  ) {
    logger.info(
      "Skipping database creation initializer because production database sa:master credentials are not available."
    )
    return
  } else {
    dbConfig.connection.user = "postgres" // default user that should always exist
    dbConfig.connection.database = "postgres" // default database that should always exist
  }

  const dbMigrationClient = knex(dbConfig)

  if (await databaseExists(dbMigrationClient, DB_DATABASE)) return

  logger.warn(`Database ${DB_DATABASE} does not exist: creating...`)
  await dbMigrationClient.raw(`CREATE DATABASE "${DB_DATABASE}"`).catch((error) => {
    logger.error("Failed to create database: " + error)
  })
  return
}

export default createDatabase
