import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request, Response } from 'express'
import env from 'src/config/env'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { UserRoleEnum } from 'src/utils/enum/user'
import { response } from 'src/utils/helper/common'
import { logError } from 'src/utils/helper/log'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from 'src/utils/helper/token'
import { DataSource } from 'typeorm'
import { LogRepository } from '../log/log.repository'
import { PackageRepository } from '../package/package.repository'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserEntity } from '../user/user.entity'
import { UserRepository } from '../user/user.repository'
import { ITokenData } from './auth.interface'
import { LoginDTO } from './dto/login.dto'
import { RegisterDTO } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly packageRepository: PackageRepository,
    private readonly logRepository: LogRepository
  ) {}

  async register(body: RegisterDTO, res: Response) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const { email } = body

      const existingUser = await this.userRepository.findOne({ email })
      if (existingUser) {
        return response({}, true, HTTP_RESPONSE.USER.EMAIL_EXIST)
      }

      const defaultPackage = await this.packageRepository.findOne({ price: 0 })
      if (!defaultPackage) {
        return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
      }

      const userRepo = queryRunner.manager.getRepository(UserEntity)
      const userSubscriptionRepo = queryRunner.manager.getRepository(UserSubscriptionEntity)

      const userToCreate = userRepo.create({ ...body, role: UserRoleEnum.USER })
      const createdUser = await userRepo.save(userToCreate)

      const subscriptionStartDate = new Date()
      const subscriptionEndDate = new Date()
      const packageDuration = defaultPackage.duration ?? 0
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() + packageDuration)

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
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })
      res.cookie(env.REFRESH_TOKEN, refreshToken, {
        httpOnly: true, // cookie chỉ được truy cập bới server
        secure: true, // cookie chỉ được sử dụng với https
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })

      await queryRunner.commitTransaction()

      return response({}, false, HTTP_RESPONSE.AUTHORIZATION.REGISTER_SUCCESS)
    } catch (error: any) {
      await queryRunner.rollbackTransaction()
      this.logRepository.insertOne(logError({ method: 'Auth Service-register', error }))
      throw new InternalServerErrorException(error.message)
    } finally {
      await queryRunner.release()
    }
  }

  async login(body: LoginDTO, res: Response) {
    try {
      const { email, sub } = body

      const user = await this.userRepository.findOne({ email, sub })
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
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })
      res.cookie(env.REFRESH_TOKEN, refreshToken, {
        httpOnly: true, // cookie chỉ được truy cập bới server
        secure: true, // cookie chỉ được sử dụng với https
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })

      return response({}, false, HTTP_RESPONSE.AUTHORIZATION.LOGIN_SUCCESS)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Auth Service-login', error }))
      throw new InternalServerErrorException(error.message)
    }
  }

  checkAuth(req: Request, res: Response) {
    try {
      const accessToken = req.cookies[env.ACCESS_TOKEN]
      if (!accessToken) return response(null, false, HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST)

      const { data, message } = verifyAccessToken(accessToken)
      // nếu có dữ liệu trong access token và không có lỗi nào xảy ra thì trả về dữ liệu
      if (data) return response(data, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)

      // nếu có lỗi xảy ra và lỗi đó không phải là lỗi token hết hạn thì trả về invalid token
      if (message && message !== HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
        return response(null, false, HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID)
      }

      // nếu lỗi là lỗi token hết hạn thì kiểm tra refresh token
      if (message && message === HTTP_RESPONSE.AUTHORIZATION.TOKEN_EXPIRED) {
        const refreshToken = req.cookies[env.REFRESH_TOKEN]
        if (!refreshToken) return response(null, false, HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST)

        const { data, message } = verifyRefreshToken(refreshToken)
        // nếu có lỗi xảy ra khi verify refresh token thì trả về message lỗi
        if (message) return response(null, false, message)

        // nếu có dữ liệu trong refresh token thì tạo mới access token và refresh token rồi trả về dữ liệu
        if (data) {
          const newAccessToken = generateAccessToken(data)
          const newRefreshToken = generateRefreshToken(data)

          res.cookie(env.ACCESS_TOKEN, newAccessToken, {
            httpOnly: true, // cookie chỉ được truy cập bới server
            secure: true, // cookie chỉ được sử dụng với https
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
          })
          res.cookie(env.REFRESH_TOKEN, newRefreshToken, {
            httpOnly: true, // cookie chỉ được truy cập bới server
            secure: true, // cookie chỉ được sử dụng với https
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
          })

          return response(data, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
        }
      }

      // trừ các trường hợp được xử lý ở trên thì các trường hợp còn lại đều trả về invalid token
      return response(null, false, HTTP_RESPONSE.AUTHORIZATION.TOKEN_INVALID)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Auth Service-checkAuth', error }))
      throw new InternalServerErrorException(error.message)
    }
  }

  async getDetailProfile(req: Request, res: Response) {
    try {
      const { id } = req.user

      const user = await this.userRepository.getUserById(id)
      if (!user) {
        res.clearCookie(env.ACCESS_TOKEN)
        res.clearCookie(env.REFRESH_TOKEN)
        return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)
      }

      return response(user, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Auth Service-getDetailProfile', error }))
      throw new InternalServerErrorException(error.message)
    }
  }

  logout(res: Response) {
    res.clearCookie(env.ACCESS_TOKEN)
    res.clearCookie(env.REFRESH_TOKEN)

    return response({}, false, HTTP_RESPONSE.AUTHORIZATION.LOGOUT_SUCCESS)
  }
}
