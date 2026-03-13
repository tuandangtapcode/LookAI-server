import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request, Response } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { UserRoleEnum } from 'src/utils/enum/user'
import { response } from 'src/utils/helper/common'
import { encodeData, ITokenData } from 'src/utils/helper/token'
import { PackageRepository } from '../package/package.repository'
import { UserRepository } from '../user/user.repository'
import { LoginDTO } from './dto/login.dto'
import { RegisterDTO } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly packageRepository: PackageRepository
  ) {}

  async register(body: RegisterDTO, res: Response) {
    try {
      const { email } = body
      const userByEmail = await this.userRepository.findOne({ email })
      if (userByEmail) return response({}, true, HTTP_RESPONSE.USER.EMAIL_EXIST)
      const defaultPackage = await this.packageRepository.findOne({ price: 0 })
      if (!defaultPackage) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
      const newUser = await this.userRepository.createUser(body, UserRoleEnum.USER, defaultPackage)
      const tokenData: ITokenData = {
        id: newUser.id,
        name: newUser.userName,
        role: newUser.role
      }
      const token = encodeData(tokenData)
      res.cookie('token', token, {
        httpOnly: true, // cookie chỉ được truy cập bới server
        secure: true, // cookie chỉ được sử dụng với https
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24
      })
      return response(token, false, HTTP_RESPONSE.AUTHORIZATION.REGISTER_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
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
      const token = encodeData(tokenData)
      res.cookie('token', token, {
        httpOnly: true, // cookie chỉ được truy cập bới server
        secure: true, // cookie chỉ được sử dụng với https
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 24
      })
      return response(token, false, HTTP_RESPONSE.AUTHORIZATION.LOGIN_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  checkAuth(req: Request) {
    return response(
      req.cookies.token ? req.cookies.token : false,
      false,
      `${req.cookies.token ? HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS : HTTP_RESPONSE.AUTHORIZATION.TOKEN_NOT_EXIST}`
    )
  }

  async getDetailProfile(req: Request, res: Response) {
    try {
      const { id } = req.user
      const user = await this.userRepository.getUserById(id)
      if (!user) {
        response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)
        res.clearCookie('token')
        return
      }
      return response(user, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  logout(res: Response) {
    res.clearCookie('token')
    return response({}, false, HTTP_RESPONSE.AUTHORIZATION.LOGOUT_SUCCESS)
  }
}
