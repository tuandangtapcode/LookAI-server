import jwt from 'jsonwebtoken'
import env from 'src/config/env'
import { ITokenData } from 'src/modules/auth/auth.interface'
import HTTP_RESPONSE from '../const/http-response'

export const generateAccessToken = (payload: ITokenData) => {
  console.log('env.PD_ACCESS_TOKEN_EXPIRES_IN', env.PD_ACCESS_TOKEN_EXPIRES_IN)
  const accessToken: string = jwt.sign(payload, env.PD_ACCESS_TOKEN, {
    expiresIn: env.PD_ACCESS_TOKEN_EXPIRES_IN || 300
  })

  return accessToken
}

export const generateRefreshToken = (payload: ITokenData) => {
  console.log('env.PD_REFRESH_TOKEN_EXPIRES_IN', env.PD_REFRESH_TOKEN_EXPIRES_IN)
  const refreshToken: string = jwt.sign(payload, env.PD_REFRESH_TOKEN, {
    expiresIn: env.PD_REFRESH_TOKEN_EXPIRES_IN || 604800
  })

  return refreshToken
}

export const verifyAccessToken = (token: string) => {
  try {
    const payload: any = jwt.verify(token, env.PD_ACCESS_TOKEN)
    const tokenData: ITokenData = {
      id: payload.id,
      name: payload.name,
      role: payload.role
    }

    return {
      message: null,
      data: tokenData
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return {
        data: null,
        message: HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED
      }
    } else {
      return {
        data: null,
        message: HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID
      }
    }
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    const payload: any = jwt.verify(token, env.PD_REFRESH_TOKEN)
    const tokenData: ITokenData = {
      id: payload.id,
      name: payload.name,
      role: payload.role
    }

    return {
      message: null,
      data: tokenData
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return {
        data: null,
        message: HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED
      }
    } else {
      return {
        data: null,
        message: HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID
      }
    }
  }
}
