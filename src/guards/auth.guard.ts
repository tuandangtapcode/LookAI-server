/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http_response'
import { decodeData } from 'src/utils/helper/token'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const token: string = request.cookies.token
    if (!token) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST)
    const data = decodeData(token)
    if (!data) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_WITHOUT_DATA)
    request.user = data
    return true
  }
}
