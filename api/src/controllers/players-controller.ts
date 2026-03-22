import { isNil } from "lodash"

import { Player } from "@/models"
import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"
import { PlayersPolicy } from "@/policies"
import { CreateService } from "@/services/players"

export class PlayersController extends BaseController<Player> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedPlayers = PlayersPolicy.applyScope(scopes, this.currentPlayer)

      const totalCount = await scopedPlayers.count({ where })
      const players = await scopedPlayers.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      return this.response.json({
        players,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching players: ${error}`, { error })
      return this.response.status(400).json({
        message: "Error fetching players",
      })
    }
  }

  async show() {
    try {
      const player = await this.loadPlayer()

      if (isNil(player)) {
        return this.response.status(404).json({
          message: "Player not found",
        })
      }

      const policy = this.buildPolicy(player)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this player." })
      }

      return this.response.json({ player })
    } catch (error) {
      logger.error(`Error fetching User: ${error}`, { error })
      return this.response.status(422).json({ message: "Error fetching player" })
    }
  }

  async create() {
    try {
      const player = await this.buildPlayer()

      const policy = this.buildPolicy(player)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this player." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newPlayer = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ player: newPlayer })
    } catch (error) {
      logger.error(`Player creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: "User creation failed" })
    }
  }

  private async buildPlayer() {
    return Player.build(this.request.body)
  }

  private async loadPlayer(): Promise<Player | null> {
    return Player.findByPk(this.params.playerUuid)
  }

  private buildPolicy(player: Player) {
    return new PlayersPolicy(this.currentPlayer, player)
  }
}

export default PlayersController
