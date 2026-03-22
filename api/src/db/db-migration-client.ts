import path from "path"
import knex from "knex"

import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } from "@/config"

export function buildKnexConfig(): knex.Knex.Config {
  return {
    client: "pg",
    connection: {
      host: DB_HOST,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      port: DB_PORT,
    },
    migrations: {
      directory: path.resolve(__dirname, "./migrations"),
      extension: "ts",
      stub: path.resolve(__dirname, "./templates/sample-migration.ts"),
    },
    seeds: {
      directory: path.resolve(__dirname, `./seeds/${NODE_ENV}`),
      extension: "ts",
      stub: path.resolve(__dirname, "./templates/sample-seed.ts"),
    },
  }
}

const config = buildKnexConfig()
const dbMigrationClient = knex(config)

// TODO: double check this is something we want in production.
dbMigrationClient.on("query", (query) => {
  if (NODE_ENV === "production") {
    console.log(`Executing: ${query.sql}`)
  } else if (NODE_ENV === "test") {
    // don't log anything
  } else {
    console.log(`Executing (default): ${query.sql} ${JSON.stringify(query.bindings)}`)
  }
})

export default dbMigrationClient
