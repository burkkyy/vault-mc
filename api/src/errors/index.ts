export class BaseError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(code: string, message: string, statusCode: number = 422) {
    super(message)
    this.code = code
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}

export class InsufficientFundsError extends BaseError {
  constructor(message = "Insufficient funds for this operation") {
    super("INSUFFICIENT_FUNDS", message)
  }
}
