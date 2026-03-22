import { Model } from "@sequelize/core"

function buildMessage(model: Model) {
  const {
    constructor: { name },
    dataValues,
  } = model
  const stringifiedAttributes = JSON.stringify(dataValues, null, 2)
  const message = `Could not create ${name} with attributes: ${stringifiedAttributes}`
  return message
}

export class FactoryBaseError extends Error {
  constructor(model: Model, cause?: unknown) {
    const message = buildMessage(model)
    super(message)
    this.name = "FactoryBaseError"

    if (cause instanceof Error) {
      this.stack = cause.stack
    }
  }
}
