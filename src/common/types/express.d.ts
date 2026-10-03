import { ITokenData } from 'src/common/helper/token'

declare global {
  namespace Express {
    interface Request {
      user: ITokenData
    }
  }
}

export {}
