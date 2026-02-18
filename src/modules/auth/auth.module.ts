import { Module } from '@nestjs/common'
import { PackageModule } from '../package/package.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [UserModule, PackageModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
