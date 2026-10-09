import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { CookieOptions, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import Redis from 'ioredis'
import { randomUUID } from 'node:crypto'
import HTTP_RESPONSE from 'src/common/const/http-response'
import { response } from 'src/common/helper/common'
import {
  checkAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from 'src/common/helper/token'
import env from 'src/config/env'
import { DataSource } from 'typeorm'
import { MailService } from '../mail/mail.service'
import { PackageRepository } from '../package/package.repository'
import { REDIS_CLIENT } from '../redis/redis.constant'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserEntity } from '../user/user.entity'
import { UserRoleEnum } from '../user/user.enum'
import { UserRepository } from '../user/user.repository'
import { GOOGLE_OAUTH_CLIENT } from './auth.constant'
import { ITokenData } from './auth.interface'
import { LoginDTO } from './dto/login.dto'
import { RegisterDTO } from './dto/register.dto'

const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true, // cookie chỉ được truy cập bới server
  secure: true, // cookie chỉ được sử dụng với https
  sameSite: 'lax'
}

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly packageRepository: PackageRepository,
    private readonly mailService: MailService,
    @Inject(GOOGLE_OAUTH_CLIENT)
    private readonly oauthClient: OAuth2Client,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis
  ) {}

  private async getGoogleInfo(code: string) {
    const { tokens } = await this.oauthClient.getToken(code)
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: env.GOOGLE_OAUTH_CLIENT_ID
    })
    const payload = ticket.getPayload()

    return payload
  }

  async register(body: RegisterDTO, res: Response) {
    const googleInfo = await this.getGoogleInfo(body.code)
    if (!googleInfo) return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)

    const existingUser = await this.userRepository.findOne({ sub: googleInfo.sub })
    if (existingUser) {
      return response({}, true, HTTP_RESPONSE.USER.EMAIL_EXIST)
    }

    const defaultPackage = await this.packageRepository.findOne({ price: 0 })
    if (!defaultPackage) {
      return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
    }

    const createdUser = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(UserEntity)
      const userSubscriptionRepo = manager.getRepository(UserSubscriptionEntity)

      const user = await userRepo.save(
        userRepo.create({
          ...body,
          role: UserRoleEnum.USER,
          sub: googleInfo.sub,
          userName: googleInfo.name,
          avatar: googleInfo.picture,
          email: googleInfo.email
        })
      )

      const subscriptionStartDate = new Date()
      const subscriptionEndDate = new Date()
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)

      await userSubscriptionRepo.save(
        userSubscriptionRepo.create({
          userId: user.id,
          packageId: defaultPackage.id,
          quota: defaultPackage.quota,
          startDate: subscriptionStartDate,
          endDate: subscriptionEndDate
        })
      )

      return user
    })

    await this.createSession(res, createdUser)

    this.mailService.sendMailRegisterSuccess(createdUser.email, createdUser.userName)

    return response({}, false, HTTP_RESPONSE.AUTHORIZATION.REGISTER_SUCCESS)
  }

  async login(body: LoginDTO, res: Response) {
    const googleInfo = await this.getGoogleInfo(body.code)
    if (!googleInfo) return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)

    const user = await this.userRepository.findOne({ sub: googleInfo.sub })
    if (!user) return response({}, true, HTTP_RESPONSE.USER.EMAIL_NOT_EXIST)

    await this.createSession(res, user)

    return response({}, false, HTTP_RESPONSE.AUTHORIZATION.LOGIN_SUCCESS)
  }

  checkAuth(req: Request) {
    const { error, tokenData, reason } = checkAccessToken(req)

    return response(tokenData, error, reason)
  }

  async getDetailProfile(req: Request, res: Response) {
    const { id } = req.user

    const user = await this.userRepository.getUserById(id)
    if (!user) {
      await this.revokeRefreshToken(req)
      this.clearAuthCookies(res)

      return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)
    }

    return response(user, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async logout(req: Request, res: Response) {
    await this.revokeRefreshToken(req)
    this.clearAuthCookies(res)

    return response({}, false, HTTP_RESPONSE.AUTHORIZATION.LOGOUT_SUCCESS)
  }

  async refresh(req: Request, res: Response) {
    const refreshToken: string = req.cookies[env.REFRESH_TOKEN]
    if (!refreshToken) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST)

    const { data, message } = verifyRefreshToken(refreshToken)
    if (message || !data) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID)

    const refreshTokenInRedis = await this.redisClient.get(`rt:${data.id}:${data.jti}`)
    if (!refreshTokenInRedis) throw new UnauthorizedException(HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID)

    res.cookie(env.ACCESS_TOKEN, generateAccessToken(data), {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: env.MAX_AGE_ACCESS_TOKEN_COOKIES
    })

    return response({}, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  private async createSession(res: Response, user: UserEntity) {
    const tokenData: ITokenData = {
      id: user.id,
      name: user.userName,
      role: user.role,
      jti: randomUUID()
    }

    await this.redisClient.set(`rt:${tokenData.id}:${tokenData.jti}`, 'OK', 'EX', env.MG_REFRESH_TOKEN_EXPIRES_IN)

    res.cookie(env.ACCESS_TOKEN, generateAccessToken(tokenData), {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: env.MAX_AGE_ACCESS_TOKEN_COOKIES
    })
    res.cookie(env.REFRESH_TOKEN, generateRefreshToken(tokenData), {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: env.MAX_AGE_REFRESH_TOKEN_COOKIES
    })
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie(env.ACCESS_TOKEN, AUTH_COOKIE_OPTIONS)
    res.clearCookie(env.REFRESH_TOKEN, AUTH_COOKIE_OPTIONS)
  }

  private async revokeRefreshToken(req: Request) {
    const refreshToken: string = req.cookies[env.REFRESH_TOKEN]
    const { data } = verifyRefreshToken(refreshToken)
    if (data) {
      await this.redisClient.del(`rt:${data.id}:${data.jti}`)
    }
  }
}
