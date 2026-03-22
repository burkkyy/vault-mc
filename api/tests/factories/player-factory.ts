import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { Player } from "@/models"

export const playerFactory = Factory.define<Player>(() => {
  const uuid = faker.string.uuid()

  return Player.build({
    uuid,
  })
})

export default playerFactory
