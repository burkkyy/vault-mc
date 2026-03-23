import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { Player } from "@/models"
import { NO_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class PlayersPolicy extends PolicyFactory(Player) {
  show(): boolean {
    if (this.player.id === this.record.id) {
      return true
    }

    return false
  }

  create(): boolean {
    return false
  }

  update(): boolean {
    if (this.player.id === this.record.id) {
      return true
    }

    return false
  }

  destroy(): boolean {
    return false
  }

  permittedAttributes(): Path[] {
    return ["purseBalance"]
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes(), "uuid", "username"]
  }

  static policyScope(_player: Player): FindOptions<Attributes<Player>> {
    return NO_RECORDS_SCOPE
  }
}
