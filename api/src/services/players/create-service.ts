import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import db, { Account, Player } from "@/models"
import BaseService from "@/services/base-service"

export type PlayerCreationAttributes = Partial<CreationAttributes<Player>>

export class CreateService extends BaseService {
  constructor(private attributes: PlayerCreationAttributes) {
    super()
  }

  async perform() {
    return db.transaction(async () => {
      const { uuid, username, ...optionalAttributes } = this.attributes

      if (isNil(uuid) || isEmpty(uuid)) {
        throw new Error("uuid is required")
      }

      if (isNil(username) || isEmpty(username)) {
        throw new Error("username is required")
      }

      const newPlayer = await Player.create({
        ...optionalAttributes,
        uuid,
        username,
      })

      const newAccount = await Account.create({
        ownerUuid: uuid,
        ownerType: Account.OwnerTypes.PLAYER,
      })

      return { player: newPlayer, account: newAccount }
    })
  }
}

export default CreateService
