import express from "express"
import cors from "cors"
import helmet from "helmet"
import formData from "express-form-data"

import { requestLoggerMiddleware } from "@/middlewares"
import router from "@/router"

export const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(formData.parse({ autoClean: true })) // for parsing multipart/form-data with connect-multiparty.
app.use(formData.union()) // union the body and the files when parsing multipart/form-data.
app.use(helmet())
app.use(cors())

app.use(requestLoggerMiddleware)

app.use(router)

export default app
