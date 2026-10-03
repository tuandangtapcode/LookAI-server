import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { handleToken } from 'src/common/helper/token'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    const { error, tokenData, reason } = handleToken(request, response)

    if (error) {
      throw new UnauthorizedException(reason)
    }

    request.user = tokenData
    return true
  }
}
