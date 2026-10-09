import { Module } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import env from 'src/config/env'
import { MailModule } from '../mail/mail.module'
import { PackageModule } from '../package/package.module'
import { RedisModule } from '../redis/redis.module'
import { UserModule } from '../user/user.module'
import { GOOGLE_OAUTH_CLIENT } from './auth.constant'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [UserModule, PackageModule, MailModule, RedisModule],
  controllers: [AuthController],
  providers: [
    {
      provide: GOOGLE_OAUTH_CLIENT,
      useFactory: () =>
        new OAuth2Client({
          clientId: env.GOOGLE_OAUTH_CLIENT_ID,
          clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
          redirectUri: env.GOOGLE_OAUTH_CLIENT_REDIRECT_URL
        })
    },
    AuthService
  ]
})
export class AuthModule {}
