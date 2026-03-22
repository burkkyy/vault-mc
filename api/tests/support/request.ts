import supertest, { AgentOptions } from "supertest"
import { type App } from "supertest/types"

import defaultApp from "@/app"

export function request(options?: AgentOptions | undefined, app: App = defaultApp) {
  return supertest(app, options)
}

export default request
