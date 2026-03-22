import db from "@/db/db-client"

// Models
import { Player } from "@/models/player"

db.addModels([Player])

// Lazy load scopes
Player.establishScopes()

export { Player }

// Special db instance will all models loaded
export default db
