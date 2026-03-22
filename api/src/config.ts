import path from "path"
import * as dotenv from "dotenv"
import { Knex } from "knex"

import { stripTrailingSlash } from "@/utils/strip-trailing-slash"

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

export const FRONTEND_URL = process.env.FRONTEND_URL || ""
export const AUTH0_DOMAIN = stripTrailingSlash(process.env.VITE_AUTH0_DOMAIN || "")
export const AUTH0_AUDIENCE = process.env.VITE_AUTH0_AUDIENCE
export const AUTH0_REDIRECT = process.env.VITE_AUTH0_REDIRECT || process.env.FRONTEND_URL || ""

export const APPLICATION_NAME = process.env.VITE_APPLICATION_NAME || ""

export const AZURE_SQL_HOST = process.env.AZURE_SQL_HOST || ""
export const AZURE_SQL_USERNAME = process.env.AZURE_SQL_USERNAME || ""
export const AZURE_SQL_PASSWORD = process.env.AZURE_SQL_PASSWORD || ""
export const AZURE_SQL_DATABASE = process.env.AZURE_SQL_DATABASE || ""
export const AZURE_SQL_PORT = parseInt(process.env.AZURE_SQL_PORT || "1433")
export const AZURE_TRUST_SERVER_CERTIFICATE = process.env.AZURE_TRUST_SERVER_CERTIFICATE === "true"
export const AZURE_REDIS_HOST = process.env.AZURE_REDIS_HOST || ""
export const AZURE_REDIS_PORT = parseInt(process.env.AZURE_REDIS_PORT || "6380")
export const AZURE_REDIS_PASSWORD = process.env.AZURE_REDIS_PASSWORD || ""

export const JOB_CONCURRENCY = parseInt(process.env.JOB_CONCURRENCY || "5")
export const JOB_QUEUES: [queueName: string, priority: number][] = [
  ["high", 1],
  ["default", 2],
  ["mailer", 2],
  ["low", 4],
]

export const RELEASE_TAG = process.env.RELEASE_TAG || ""
export const GIT_COMMIT_HASH = process.env.GIT_COMMIT_HASH || ""

export const RUN_SCHEDULER = process.env.RUN_SCHEDULER || "false"

export const AWS_LOGGING_ENABLED = process.env.AWS_LOGGING_ENABLED || "false"
export const AWS_LOGGING_GROUP = process.env.AWS_LOGGING_GROUP || ""
export const AWS_LOGGING_STREAM = process.env.AWS_LOGGING_STREAM || ""
export const AWS_LOGGING_REGION = process.env.AWS_LOGGING_REGION || "ca-central-1"
export const AWS_LOGGING_ACCESS_ID = process.env.AWS_LOGGING_ACCESS_ID || ""
export const AWS_LOGGING_ACCESS_KEY = process.env.AWS_LOGGING_ACCESS_KEY || ""
export const DEFAULT_LOG_LEVEL = process.env.DEFAULT_LOG_LEVEL || "debug"

export const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || ""
export const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY || ""

export const DB_CONFIG: Knex.Config = {
  client: "mssql",
  connection: {
    host: AZURE_SQL_HOST,
    user: AZURE_SQL_USERNAME,
    password: AZURE_SQL_PASSWORD,
    database: AZURE_SQL_DATABASE,
    port: AZURE_SQL_PORT,
    options: {
      encrypt: true,
      trustServerCertificate: AZURE_TRUST_SERVER_CERTIFICATE,
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
