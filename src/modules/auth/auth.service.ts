import { Inject, Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import HTTP_RESPONSE from 'src/common/const/http-response'
import { response } from 'src/common/helper/common'
import { generateAccessToken, generateRefreshToken, handleToken } from 'src/common/helper/token'
import env from 'src/config/env'
import { DataSource } from 'typeorm'
import { PackageRepository } from '../package/package.repository'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserEntity } from '../user/user.entity'
import { UserRoleEnum } from '../user/user.enum'
import { UserRepository } from '../user/user.repository'
import { GOOGLE_OAUTH_CLIENT } from './auth.constant'
import { ITokenData } from './auth.interface'
import { LoginDTO } from './dto/login.dto'
import { RegisterDTO } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly packageRepository: PackageRepository,
    @Inject(GOOGLE_OAUTH_CLIENT)
    private readonly oauthClient: OAuth2Client
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
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const { code } = body

      const googleInfo = await this.getGoogleInfo(code)
      if (!googleInfo) return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)

      const existingUser = await this.userRepository.findOne({ sub: googleInfo.sub })
      if (existingUser) {
        return response({}, true, HTTP_RESPONSE.USER.EMAIL_EXIST)
      }

      const defaultPackage = await this.packageRepository.findOne({ price: 0 })
      if (!defaultPackage) {
        return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
      }

      const userRepo = queryRunner.manager.getRepository(UserEntity)
      const userSubscriptionRepo = queryRunner.manager.getRepository(UserSubscriptionEntity)

      const userToCreate = userRepo.create({
        ...body,
        role: UserRoleEnum.USER,
        sub: googleInfo.sub,
        userName: googleInfo.name,
        avatar: googleInfo.picture,
        email: googleInfo.email
      })
      const createdUser = await userRepo.save(userToCreate)

      const subscriptionStartDate = new Date()
      const subscriptionEndDate = new Date()
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)

      const subscriptionToCreate = userSubscriptionRepo.create({
        userId: createdUser.id,
        packageId: defaultPackage.id,
        quota: defaultPackage.quota,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate
      })
      await userSubscriptionRepo.save(subscriptionToCreate)

      const tokenData: ITokenData = {
        id: createdUser.id,
        name: createdUser.userName,
        role: createdUser.role
      }
      const accessToken = generateAccessToken(tokenData)
      const refreshToken = generateRefreshToken(tokenData)

      res.cookie(env.ACCESS_TOKEN, accessToken, {
        httpOnly: true, // cookie chỉ được truy cập bới server
        secure: true, // cookie chỉ được sử dụng với https
        sameSite: 'lax',
        maxAge: env.MAX_AGE_ACCESS_TOKEN_COOKIES
      })
      res.cookie(env.REFRESH_TOKEN, refreshToken, {
        httpOnly: true, // cookie chỉ được truy cập bới server
        secure: true, // cookie chỉ được sử dụng với https
        sameSite: 'lax',
        maxAge: env.MAX_AGE_REFRESH_TOKEN_COOKIES
      })

      await queryRunner.commitTransaction()

      return response({}, false, HTTP_RESPONSE.AUTHORIZATION.REGISTER_SUCCESS)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async login(body: LoginDTO, res: Response) {
    const { code } = body

    const googleInfo = await this.getGoogleInfo(code)
    if (!googleInfo) return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)

    const user = await this.userRepository.findOne({ sub: googleInfo.sub })
    if (!user) return response({}, true, HTTP_RESPONSE.USER.EMAIL_NOT_EXIST)

    const tokenData: ITokenData = {
      id: user.id,
      name: user.userName,
      role: user.role
    }
    const accessToken = generateAccessToken(tokenData)
    const refreshToken = generateRefreshToken(tokenData)

    res.cookie(env.ACCESS_TOKEN, accessToken, {
      httpOnly: true, // cookie chỉ được truy cập bới server
      secure: true, // cookie chỉ được sử dụng với https
      sameSite: 'lax',
      maxAge: env.MAX_AGE_ACCESS_TOKEN_COOKIES
    })
    res.cookie(env.REFRESH_TOKEN, refreshToken, {
      httpOnly: true, // cookie chỉ được truy cập bới server
      secure: true, // cookie chỉ được sử dụng với https
      sameSite: 'lax',
      maxAge: env.MAX_AGE_REFRESH_TOKEN_COOKIES
    })

    return response({}, false, HTTP_RESPONSE.AUTHORIZATION.LOGIN_SUCCESS)
  }

  checkAuth(req: Request, res: Response) {
    const { error, tokenData, reason } = handleToken(req, res)

    return response(tokenData, error, reason)
  }

  async getDetailProfile(req: Request, res: Response) {
    const { id } = req.user

    const user = await this.userRepository.getUserById(id)
    if (!user) {
      res.clearCookie(env.ACCESS_TOKEN)
      res.clearCookie(env.REFRESH_TOKEN)
      return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)
    }

    return response(user, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  logout(res: Response) {
    res.clearCookie(env.ACCESS_TOKEN)
    res.clearCookie(env.REFRESH_TOKEN)

    return response({}, false, HTTP_RESPONSE.AUTHORIZATION.LOGOUT_SUCCESS)
  }
}
