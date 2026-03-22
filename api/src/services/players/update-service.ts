import { Attributes } from "@sequelize/core"

import { Player } from "@/models"
import BaseService from "@/services/base-service"

export type PlayerAttributes = Partial<Attributes<Player>>

export class UpdateService extends BaseService {
  constructor(
    private player: Player,
    private attributes: PlayerAttributes
  ) {
    super()
  }

  async perform() {
    return this.player.update(this.attributes)
  }
}

export default UpdateService
