import path from "path"
import * as dotenv from "dotenv"
import { Knex } from "knex"

export const NODE_ENV = process.env.NODE_ENV || "development"

let dotEnvPath
switch (process.env.NODE_ENV) {
  case "test":
    dotEnvPath = path.resolve(__dirname, "../.env.test")
    break
  case "production":
    dotEnvPath = path.resolve(__dirname, "../.env.production")
    break
  default:
    dotEnvPath = path.resolve(__dirname, "../.env.development")
}

dotenv.config({ path: dotEnvPath })

if (process.env.NODE_ENV !== "test") {
  console.log("Loading env: ", dotEnvPath)
}

export const API_PORT = process.env.API_PORT || "3000"
export const JOB_PORT = process.env.JOB_PORT || "3001"

export const APPLICATION_NAME = process.env.VITE_APPLICATION_NAME || ""

export const DB_HOST = process.env.DB_HOST || ""
export const DB_USERNAME = process.env.DB_USERNAME || ""
export const DB_PASSWORD = process.env.DB_PASSWORD || ""
export const DB_DATABASE = process.env.DB_DATABASE || ""
export const DB_PORT = parseInt(process.env.DB_PORT || "5432")
export const DB_TRUST_SERVER_CERTIFICATE = process.env.DB_TRUST_SERVER_CERTIFICATE === "true"

export const RELEASE_TAG = process.env.RELEASE_TAG || ""
export const GIT_COMMIT_HASH = process.env.GIT_COMMIT_HASH || ""

export const RUN_SCHEDULER = process.env.RUN_SCHEDULER || "false"

export const DEFAULT_LOG_LEVEL = process.env.DEFAULT_LOG_LEVEL || "debug"

export const DB_CONFIG: Knex.Config = {
  client: "pg",
  connection: {
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    options: {
      encrypt: true,
      trustServerCertificate: DB_TRUST_SERVER_CERTIFICATE,
    },
  },
  migrations: {
    directory: path.resolve(__dirname, "./db/migrations"),
    extension: "ts",
    stub: path.resolve(__dirname, "./db/templates/sample-migration.ts"),
  },
  seeds: {
    directory: path.resolve(__dirname, `./db/seeds/${NODE_ENV}`),
    extension: "ts",
    stub: path.resolve(__dirname, "./db/templates/sample-seed.ts"),
  },
}

// Internal Helpers
export const APP_ROOT_PATH = path.resolve(__dirname, "..")
export const SOURCE_ROOT_PATH =
  NODE_ENV === "production" ? path.join(APP_ROOT_PATH, "dist") : path.join(APP_ROOT_PATH, "src")
