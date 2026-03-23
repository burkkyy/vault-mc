import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsTo,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import Account from "@/models/account"

export class Transfer extends BaseModel<
  InferAttributes<Transfer>,
  InferCreationAttributes<Transfer>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fromAccountId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare toAccountId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare amount: number

  @Attribute(DataTypes.STRING(255))
  declare note: string | null

  @Attribute(DataTypes.DATE(0))
  @NotNull
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Associations
  @BelongsTo(() => Account, {
    foreignKey: {
      name: "fromAccountId",
      allowNull: false,
    },
    inverse: {
      as: "sentTransfers",
      type: "hasMany",
    },
  })
  declare from?: NonAttribute<Account>

  @BelongsTo(() => Account, {
    foreignKey: {
      name: "toAccountId",
      allowNull: false,
    },
    inverse: {
      as: "receivedTransfers",
      type: "hasMany",
    },
  })
  declare to?: NonAttribute<Account>

  static establishScopes(): void {}
}

export default Transfer
