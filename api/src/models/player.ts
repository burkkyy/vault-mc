import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core"
import { Attribute, NotNull, PrimaryKey } from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"

export class Player extends BaseModel<InferAttributes<Player>, InferCreationAttributes<Player>> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  declare uuid: string

  @Attribute(DataTypes.DATE(0))
  @NotNull
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Associations

  static establishScopes(): void {}
}

export default Player
