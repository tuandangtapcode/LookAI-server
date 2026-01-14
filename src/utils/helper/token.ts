/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import CryptoJS from 'crypto-js'
import env from '../../config/env'
import { UserRoleEnum } from '../enum/user'

export interface ITokenData {
  id: string
  name: string
  role: UserRoleEnum
}

export const encodeData = (object: ITokenData) => {
  return CryptoJS.AES.encrypt(JSON.stringify(object), env.HASH_KEY || 'HASH_KEY').toString() as unknown as string
}

export const decodeData = (data_hashed: string) => {
  const decryptedBytes = CryptoJS.AES.decrypt(data_hashed, env.HASH_KEY || 'HASH_KEY')
  const dataUser: ITokenData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8))
  return dataUser
}
