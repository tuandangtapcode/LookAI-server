import { Injectable, InternalServerErrorException } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { CreateSystemkeyDTO } from './dto/create-systemkey.dto'
import { InsertChildkeyDTO } from './dto/insert-child-key.dto'
import { SystemkeyRepository } from './systemkey.repository'

@Injectable()
export class SystemkeyService {
  constructor(private readonly systemkeyRepository: SystemkeyRepository) {}

  async createSystemkey(data: CreateSystemkeyDTO) {
    try {
      const { keyName } = data
      const checkExistKeyName = await this.systemkeyRepository.findOne({ keyName })
      if (checkExistKeyName) {
        return response({}, true, HTTP_RESPONSE.SYSTEM_KEY.KEY_NAME_EXIST)
      }
      await this.systemkeyRepository.createSystemkey(data)
      return response({}, false, HTTP_RESPONSE.SYSTEM_KEY.CREATED_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListSystemkey() {
    try {
      const result = await this.systemkeyRepository.findMany({})
      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async insertChildkey(body: InsertChildkeyDTO) {
    try {
      const { parentId, keyName } = body
      const checkExistKeyName = await this.systemkeyRepository.findOne({ keyName, parentId })
      if (checkExistKeyName) {
        return response({}, true, HTTP_RESPONSE.SYSTEM_KEY.KEY_NAME_EXIST)
      }

      const systemkey = await this.systemkeyRepository.getMaxChildkey(parentId)
      if (!systemkey) {
        return response({}, true, HTTP_RESPONSE.SYSTEM_KEY.KEY_NOT_EXIST)
      }
      await this.systemkeyRepository.insertOne({
        keyName,
        keyValue: systemkey.max + 1,
        parentId
      })
      return response({}, false, HTTP_RESPONSE.SYSTEM_KEY.INSERT_CHILD_KEY_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
