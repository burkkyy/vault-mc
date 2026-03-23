import { CreationAttributes, Transaction } from "@sequelize/core"

import db, { Account, Player, PurseTransaction } from "@/models"
import BaseService from "@/services/base-service"
import { isEmpty, isNil } from "lodash"
import { InsufficientFundsError } from "@/errors"

export type PurseTransactionCreateAttributes = Partial<CreationAttributes<PurseTransaction>>

export class CreateTransactionService extends BaseService {
  constructor(
    private attributes: PurseTransactionCreateAttributes,
    private player: Player,
    private account: Account
  ) {
    super()
  }

  async perform() {
    return db.transaction(async (t) => {
      const { transactionType, transactionSource, amount, ...optionalAttributes } = this.attributes

      if (isNil(transactionType) || isEmpty(transactionType)) {
        throw new Error("transactionType is required")
      }

      if (isNil(transactionSource) || isEmpty(transactionSource)) {
        throw new Error("transactionSource is required")
      }

      if (isNil(amount)) {
        throw new Error("amount is required")
      }

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0")
      }

      switch (transactionType) {
        case PurseTransaction.TransactionType.BURN:
          await this.performBurn(this.player, amount, t)
          break
        case PurseTransaction.TransactionType.DEPOSIT:
          await this.performDeposit(this.player, this.account, amount, t)
          break
        case PurseTransaction.TransactionType.MINT:
          await this.performMint(this.player, amount, t)
          break
        case PurseTransaction.TransactionType.WITHDRAWAL:
          await this.performWithdrawal(this.player, this.account, amount, t)
          break
        default:
          throw new Error("Unknown PurseTransactionType")
      }

      const purseTransaction = await PurseTransaction.create(
        {
          ...optionalAttributes,
          playerUuid: this.player.uuid,
          accountId: this.account.id,
          transactionType,
          transactionSource,
          amount,
        },
        { transaction: t }
      )

      return purseTransaction
    })
  }

  private async performBurn(player: Player, burnAmount: number, t: Transaction) {
    const currentAmount = player.purseBalance
    const newAmount = currentAmount - burnAmount

    if (newAmount < 0) {
      throw new InsufficientFundsError(
        "Burning this amount would result in negative purse balance!"
      )
    }

    await player.update(
      {
        purseBalance: newAmount,
      },
      { transaction: t }
    )
  }

  private async performDeposit(player: Player, account: Account, amount: number, t: Transaction) {
    const playerPurse = player.purseBalance
    const newPurseBalance = playerPurse - amount

    if (newPurseBalance < 0) {
      throw new InsufficientFundsError("Not enough coins in purse to deposit")
    }

    await player.update(
      {
        purseBalance: newPurseBalance,
      },
      { transaction: t }
    )
    await account.increment("balance", { by: amount, transaction: t })
  }

  private async performMint(player: Player, mintAmount: number, t: Transaction) {
    const currentAmount = player.purseBalance
    const newPurseBalance = currentAmount + mintAmount

    await player.update(
      {
        purseBalance: newPurseBalance,
      },
      { transaction: t }
    )
  }

  private async performWithdrawal(
    player: Player,
    account: Account,
    amount: number,
    t: Transaction
  ) {
    const playerPurse = player.purseBalance
    const newPurseBalance = playerPurse + amount

    if (BigInt(account.balance) - BigInt(amount) < BigInt(0)) {
      throw new InsufficientFundsError("Not enough coins in account to withdraw")
    }

    await player.update(
      {
        purseBalance: newPurseBalance,
      },
      { transaction: t }
    )
    await account.decrement("balance", { by: amount, transaction: t })
  }
}

export default CreateTransactionService
