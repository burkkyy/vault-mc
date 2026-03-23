import db from "@/db/db-client"

// Models
import { Account } from "@/models/account"
import { Player } from "@/models/player"
import { PurseTransaction } from "@/models/purse-transaction"
import { Transfer } from "@/models/transfer"

db.addModels([Account, Player, PurseTransaction, Transfer])

// Lazy load scopes
Account.establishScopes()
Player.establishScopes()
PurseTransaction.establishScopes()
Transfer.establishScopes()

export { Account, Player, PurseTransaction, Transfer }

// Special db instance will all models loaded
export default db
