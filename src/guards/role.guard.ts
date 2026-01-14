/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/decorators/role.decorator'
import HTTP_RESPONSE from 'src/utils/const/http_response'
import { UserRoleEnum } from 'src/utils/enum/user'
import { ITokenData } from 'src/utils/helper/token'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    const user: ITokenData = context.switchToHttp().getRequest().user
    const status = requiredRoles.find((role) => role === user.role)
    if (!status) throw new ForbiddenException(HTTP_RESPONSE.AUTHORIZATION.NO_ACCESS)
    return true
  }
}
