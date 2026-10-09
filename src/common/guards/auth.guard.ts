import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { checkAccessToken } from '../helper/token'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()

    const { error, tokenData, reason } = checkAccessToken(request)

    if (error) {
      throw new UnauthorizedException(reason)
    }

    request.user = tokenData
    return true
  }
}
