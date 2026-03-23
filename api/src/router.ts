import { Router, type Request, type Response, ErrorRequestHandler, NextFunction } from "express"
import { UnauthorizedError } from "express-jwt"

import { GIT_COMMIT_HASH, RELEASE_TAG } from "@/config"
import migrator from "@/db/migrator"

import { bodyAuthorizationHoistMiddleware } from "@/middlewares"
import { PlayersController, Players, AccountsController } from "@/controllers"
import { logger } from "@/utils/logger"

export const router = Router()

// non-api (no authentication is required) routes
router.route("/_status").get((_req: Request, res: Response) => {
  res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

// api routes
// Add all the standard api controller routes here
router.use("/api", bodyAuthorizationHoistMiddleware)
router.use("/migrate", migrator.migrationRouter)

// Accounts
router.route("/api/accounts").get(AccountsController.index).post(AccountsController.create)

// Players
router.route("/api/players").get(PlayersController.index).post(PlayersController.create)
router
  .route("/api/players/:playerUuid")
  .get(PlayersController.show)
  .patch(PlayersController.update)
  .delete(PlayersController.destroy)
router.route("/api/players/:playerUuid/death").post(Players.DeathController.create)
router.route("/api/players/:playerUuid/purse/burn").post(Players.Purse.BurnController.create)
router.route("/api/players/:playerUuid/purse/deposit").post(Players.Purse.DepositController.create)
router.route("/api/players/:playerUuid/purse/mint").post(Players.Purse.MintController.create)
router
  .route("/api/players/:playerUuid/purse/withdraw")
  .post(Players.Purse.WithdrawController.create)

// if no other routes match, return a 404
router.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" })
})

// Special error handler for all api errors
// See https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
router.use("/api", (err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err)
  } else if (err instanceof UnauthorizedError) {
    logger.error(err)
    res.status(err.status).json({ message: err.inner.message })
  } else {
    logger.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

export default router
