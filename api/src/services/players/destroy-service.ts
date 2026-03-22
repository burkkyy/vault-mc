import { Player } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(private player: Player) {
    super()
  }

  async perform() {
    throw new Error("Not Implemented")
  }
}

export default DestroyService
