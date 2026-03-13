import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import env from 'src/config/env'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { decodeData } from 'src/utils/helper/token'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    let token: string | null = null
    if (request.headers['x-platform'] === env.X_PLATFORM_WEB) {
      token = request.cookies.token
    } else if (request.headers['x-platform'] === env.X_PLATFORM_MOBILE) {
      token = request.headers['authorization'] as string
    }
    if (!token) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST)
    const data = decodeData(token)
    if (!data) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_WITHOUT_DATA)
    request.user = data
    return true
  }
}
