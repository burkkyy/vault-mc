import { isNil, pick } from "lodash"

import { Player } from "@/models"
import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"
import { PlayersPolicy } from "@/policies"
import { FindAccountService } from "@/services/players"
import { PurseTransactionType } from "@/models/purse-transaction"
import { CreateTransactionService } from "@/services/purse-transactions"

export class DepositController extends BaseController {
  async create() {
    try {
      const player = await this.loadPlayer()

      if (isNil(player)) {
        return this.response.status(404).json({
          message: "Player not found",
        })
      }

      const account = await FindAccountService.perform(player)

      if (isNil(account)) {
        return this.response.status(404).json({
          message: "Account for player not found",
        })
      }

      const policy = this.buildPolicy(player)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this player." })
      }

      const permittedAttributes = pick(this.request.body, [
        "transactionType", // this gets overwritten
        "transactionSource",
        "amount",
      ])

      permittedAttributes.transactionType = PurseTransactionType.DEPOSIT

      await CreateTransactionService.perform(permittedAttributes, player, account)

      return this.response.status(200).json({ message: "success" })
    } catch (error) {
      logger.error(`Handling player death failed: ${error}`, { error })
      return this.response.status(422).json({ message: "Handling player death failed" })
    }
  }

  private async loadPlayer(): Promise<Player | null> {
    return Player.findByPk(this.params.playerUuid)
  }

  private buildPolicy(player: Player) {
    return new PlayersPolicy(this.currentPlayer, player)
  }
}

export default DepositController
