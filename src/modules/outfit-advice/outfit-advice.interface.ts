import { PackageEntity } from '../package/package.entity'

export interface ICreateOutfitAdvice {
  userId: string
  package: PackageEntity
  requestPayload: string
  responsePayload: string
  inputToken: number
  outputToken: number
}

export interface ICalculateTokenUsed {
  totalInputToken: number
  totalOutputToken: number
}

export interface IGetTopTokenUsed {
  userId: string
  userName: string
  totalInputToken: number
  totalOutputToken: number
}
