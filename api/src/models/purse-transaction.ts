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
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import Player from "@/models/player"
import Account from "@/models/account"

export enum PurseTransactionType {
  MINT = "mint", // coins being created, moving into purse
  BURN = "burn", // coins being destroyed, removed from purse
  WITHDRAWAL = "withdrawal", // coins moving out of purse to account
  DEPOSIT = "deposit", // coins moving into purse from account
}

export enum PurseTransactionSource {
  SYSTEM = "system",
  PLAYER_ACTION = "player_action",
}

export class PurseTransaction extends BaseModel<
  InferAttributes<PurseTransaction>,
  InferCreationAttributes<PurseTransaction>
> {
  static readonly TransactionType = PurseTransactionType
  static readonly Source = PurseTransactionSource

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.UUID)
  @NotNull
  declare playerUuid: string

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare accountId: number

  @Attribute(DataTypes.STRING(128))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(PurseTransactionType)],
      msg: `Type must be one of ${Object.values(PurseTransactionType).join(", ")}`,
    },
  })
  declare transactionType: PurseTransactionType

  @Attribute(DataTypes.STRING(128))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(PurseTransactionSource)],
      msg: `Type must be one of ${Object.values(PurseTransactionSource).join(", ")}`,
    },
  })
  declare transactionSource: PurseTransactionSource

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare amount: number

  @Attribute(DataTypes.DATE(0))
  @NotNull
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Associations
  @BelongsTo(() => Player, {
    foreignKey: {
      name: "playerUuid",
      allowNull: false,
    },
    inverse: {
      as: "playerPurseTransactions",
      type: "hasMany",
    },
  })
  declare player?: NonAttribute<Player>

  @BelongsTo(() => Account, {
    foreignKey: {
      name: "accountId",
      allowNull: false,
    },
    inverse: {
      as: "accountPurseTransactions",
      type: "hasMany",
    },
  })
  declare account?: NonAttribute<Account>

  static establishScopes(): void {}
}

export default PurseTransaction
