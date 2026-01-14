import { ITokenData } from 'src/utils/helper/token'

declare global {
  namespace Express {
    interface Request {
      user: ITokenData
    }
  }
}

export {}
