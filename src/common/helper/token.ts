import { Request, Response } from 'express'
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
    const payload: any = jwt.verify(token, env.MG_REFRESH_TOKEN)
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

export const handleToken = (request: Request, response: Response) => {
  const accessToken: string = request.cookies[env.ACCESS_TOKEN]
  if (!accessToken) {
    return {
      error: true,
      tokenData: null,
      reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST
    }
  }

  const { data, message } = verifyAccessToken(accessToken)
  // nếu có dữ liệu trong access token và không có lỗi nào xảy ra thì cho phép truy cập
  if (data) {
    return {
      error: false,
      tokenData: data,
      reason: HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS
    }
  }

  // nếu có lỗi xảy ra và lỗi đó không phải là lỗi token hết hạn
  if (message && message !== HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
    return {
      error: true,
      tokenData: null,
      reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID
    }
  }

  // nếu lỗi là lỗi token hết hạn thì kiểm tra refresh token
  if (message && message === HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
    const refreshToken = request.cookies[env.REFRESH_TOKEN]
    if (!refreshToken) {
      return {
        error: true,
        tokenData: null,
        reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST
      }
    }

    const { data, message } = verifyRefreshToken(refreshToken)
    // nếu có lỗi xảy ra khi verify refresh token
    if (message) {
      return {
        error: true,
        tokenData: null,
        reason: message
      }
    }

    // nếu có dữ liệu trong refresh token thì tạo mới access token và refresh token
    if (data) {
      const newAccessToken = generateAccessToken(data)

      response.cookie(env.ACCESS_TOKEN, newAccessToken, {
        httpOnly: true, // cookie chỉ được truy cập bới server
        secure: true, // cookie chỉ được sử dụng với https
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })

      return {
        error: false,
        tokenData: data,
        reason: HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS
      }
    }
  }

  // trừ các trường hợp được xử lý ở trên
  return {
    error: true,
    tokenData: null,
    reason: HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST
  }
}
