import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { GetListUserDTO } from './dto/get-list-user.dto'
import { UpdateProfileDTO } from './dto/update-profile.dto'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateProfile(req: Request, body: UpdateProfileDTO) {
    try {
      const userId = req.user.id
      const user = await this.userRepository.findOne({ id: userId })
      if (!user) return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)
      const updatedUser = await this.userRepository.updateOne(user, body)
      return response(updatedUser, false, HTTP_RESPONSE.USER.UPDATE_PROFILE_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListUser(params: GetListUserDTO) {
    try {
      const result = await this.userRepository.getListUser(params)
      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getDetailUser(req: Request) {
    try {
      const userId = req.params.userId as string
      const result = await this.userRepository.getUserById(userId)
      if (!result) return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)
      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
