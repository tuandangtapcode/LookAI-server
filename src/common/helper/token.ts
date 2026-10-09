import { Request } from 'express'
import jwt from 'jsonwebtoken'
import env from 'src/config/env'
import { ITokenData } from 'src/modules/auth/auth.interface'
import HTTP_RESPONSE from '../const/http-response'

export const generateAccessToken = (payload: ITokenData) => {
  const accessToken: string = jwt.sign(payload, env.MG_ACCESS_TOKEN, {
    expiresIn: env.MG_ACCESS_TOKEN_EXPIRES_IN || 300
  })

  return accessToken
}

export const generateRefreshToken = (payload: ITokenData) => {
  const refreshToken: string = jwt.sign(payload, env.MG_REFRESH_TOKEN, {
    expiresIn: env.MG_REFRESH_TOKEN_EXPIRES_IN || 604800
  })

  return refreshToken
}

export const verifyAccessToken = (token: string) => {
  try {
    const payload: any = jwt.verify(token, env.MG_ACCESS_TOKEN)
    const tokenData: ITokenData = {
      id: payload.id,
      name: payload.name,
      role: payload.role,
      jti: payload.jti
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
    const payload: any = jwt.verify(token, env.MG_REFRESH_TOKEN)
    const tokenData: ITokenData = {
      id: payload.id,
      name: payload.name,
      role: payload.role,
      jti: payload.jti
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

export const checkAccessToken = (request: Request) => {
  const accessToken: string = request.cookies[env.ACCESS_TOKEN]
  if (!accessToken) {
    return {
      error: true,
      tokenData: null,
      reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST
    }
  }

  const { data, message } = verifyAccessToken(accessToken)
  if (data) {
    return {
      error: false,
      tokenData: data,
      reason: HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS
    }
  }

  if (message && message !== HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
    return {
      error: true,
      tokenData: null,
      reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID
    }
  }

  if (message && message === HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
    return {
      error: true,
      tokenData: null,
      reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED
    }
  }

  return {
    error: true,
    tokenData: null,
    reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID
  }
}
