import db from "@/db/db-client"

// Models
import { User } from "@/models/user"
import { Company } from "@/models/company"
import { Shareholder } from "@/models/shareholder"

db.addModels([User, Company, Shareholder])

// Lazy load scopes
User.establishScopes()
Company.establishScopes()
Shareholder.establishScopes()

export { User, Company, Shareholder }

// Special db instance will all models loaded
export default db
