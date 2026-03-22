import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { Player } from "@/models"
import BaseService from "@/services/base-service"

export type PlayerCreationAttributes = Partial<CreationAttributes<Player>>

export class CreateService extends BaseService {
  constructor(private attributes: PlayerCreationAttributes) {
    super()
  }

  async perform() {
    const { uuid, ...optionalAttributes } = this.attributes

    if (isNil(uuid) || isEmpty(uuid)) {
      throw new Error("uuid is required")
    }

    return Player.create({
      ...optionalAttributes,
      uuid,
    })
  }
}

export default CreateService
