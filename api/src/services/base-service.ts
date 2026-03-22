/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

type HasNoArgsConstructor<T> = T extends { new (): any } ? true : false

type CleanConstructorParameters<T extends typeof BaseService> =
  HasNoArgsConstructor<T> extends true ? [] : ConstructorParameters<T>

export class BaseService {
  constructor(...args: any[]) {}

  static perform<T extends typeof BaseService>(
    this: T,
    ...args: CleanConstructorParameters<T>
  ): ReturnType<InstanceType<T>["perform"]> {
    const instance = new this(...args)
    return instance.perform()
  }

  perform(): any {
    throw new Error("Not Implemented")
  }
}

export default BaseService
