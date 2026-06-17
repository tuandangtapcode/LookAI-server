import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import env from 'src/config/env'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from 'src/utils/helper/token'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    const accessToken: string = request.cookies[env.ACCESS_TOKEN]
    if (!accessToken) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST)

    const { data, message } = verifyAccessToken(accessToken)
    // nếu có dữ liệu trong access token và không có lỗi nào xảy ra thì cho phép truy cập
    if (data) {
      request.user = data
      return true
    }

    // nếu có lỗi xảy ra và lỗi đó không phải là lỗi token hết hạn thì trả về 401
    if (message && message !== HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
      throw new UnauthorizedException(message)
    }

    // nếu lỗi là lỗi token hết hạn thì kiểm tra refresh token
    if (message && message === HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
      const refreshToken = request.cookies[env.REFRESH_TOKEN]
      if (!refreshToken) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST)

      const { data, message } = verifyRefreshToken(refreshToken)
      // nếu có lỗi xảy ra khi verify refresh token thì trả về 401
      if (message) throw new UnauthorizedException(message)

      // nếu có dữ liệu trong refresh token thì tạo mới access token và refresh token, gán dữ liệu vào request.user và cho phép truy cập
      if (data) {
        const newAccessToken = generateAccessToken(data)
        const newRefreshToken = generateRefreshToken(data)

        response.cookie(env.ACCESS_TOKEN, newAccessToken, {
          httpOnly: true, // cookie chỉ được truy cập bới server
          secure: true, // cookie chỉ được sử dụng với https
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })
        response.cookie(env.REFRESH_TOKEN, newRefreshToken, {
          httpOnly: true, // cookie chỉ được truy cập bới server
          secure: true, // cookie chỉ được sử dụng với https
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })

        request.user = data

        return true
      }
    }

    // trừ các trường hợp được xử lý ở trên thì các trường hợp còn lại đều trả về 401
    throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID)
  }
}
