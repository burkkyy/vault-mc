import { Account, Player } from "@/models"
import BaseService from "@/services/base-service"

export class FindAccountService extends BaseService {
  constructor(private player: Player) {
    super()
  }

  async perform() {
    return Account.findOne({
      where: {
        ownerUuid: this.player.uuid,
        ownerType: Account.OwnerTypes.PLAYER,
      },
    })
  }
}

export default FindAccountService
