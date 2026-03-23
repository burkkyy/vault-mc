import { isNil } from "lodash"

import { Player } from "@/models"
import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"
import { PlayersPolicy } from "@/policies"

export class DeathController extends BaseController {
  async create() {
    try {
      const player = await this.loadPlayer()

      if (isNil(player)) {
        return this.response.status(404).json({
          message: "Player not found",
        })
      }

      const policy = this.buildPolicy(player)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this player." })
      }

      return this.response.status(201).json({ message: "success" })
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

export default DeathController
