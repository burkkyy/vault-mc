import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"

export enum AccountOwnerTypes {
  SYSTEM = "system",
  PLAYER = "player",
}

export class Account extends BaseModel<InferAttributes<Account>, InferCreationAttributes<Account>> {
  static readonly OwnerTypes = AccountOwnerTypes

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.UUID)
  @NotNull
  declare ownerUuid: string

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(AccountOwnerTypes)],
      msg: `Type must be one of ${Object.values(AccountOwnerTypes).join(", ")}`,
    },
  })
  declare ownerType: AccountOwnerTypes

  @Attribute(DataTypes.BIGINT)
  @NotNull
  declare balance: CreationOptional<string>

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

export default Account
