import { Sequelize, Options } from "@sequelize/core"
import { PostgresDialect } from "@sequelize/postgres"

import {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
  NODE_ENV,
  DB_TRUST_SERVER_CERTIFICATE,
} from "@/config"

if (DB_DATABASE === undefined) throw new Error("database name is unset.")
if (DB_USERNAME === undefined) throw new Error("database username is unset.")
if (DB_PASSWORD === undefined) throw new Error("database password is unset.")
if (DB_HOST === undefined) throw new Error("database host is unset.")
if (DB_PORT === undefined) throw new Error("database port is unset.")

export const SEQUELIZE_CONFIG: Options<PostgresDialect> = {
  dialect: PostgresDialect,
  user: DB_USERNAME,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  schema: "public", // default - explicit for clarity
  logging: NODE_ENV === "development" ? console.log : false,
  define: {
    underscored: true,
    timestamps: true, // default - explicit for clarity.
    paranoid: true, // adds deleted_at column
  },
  ssl: DB_TRUST_SERVER_CERTIFICATE ? false : true,
  timezone: "UTC",
}

const db = new Sequelize(SEQUELIZE_CONFIG)

export default db
