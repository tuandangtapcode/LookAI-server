import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { CreateWardrobeDTO } from './dto/create-wardrobe.dto'
import { GetListWardrobeDTO } from './dto/get-list-wardrobe.dto'
import { UpdateWardrobeDTO } from './dto/update-wardrobe.dto'
import { WardrobeRepository } from './wardrobe.repository'

@Injectable()
export class WardrobeService {
  constructor(private readonly wardrobeRepository: WardrobeRepository) {}

  async createWardrobe(req: Request, body: CreateWardrobeDTO) {
    try {
      const userId = req.user.id
      const newWardrobe = await this.wardrobeRepository.insertOne({
        ...body,
        userId
      })
      return response(newWardrobe, false, HTTP_RESPONSE.WARDROBE.CREATED_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateWardrobe(req: Request, body: UpdateWardrobeDTO) {
    try {
      const userId = req.user.id
      const { wardrobeId, ...rest } = body
      const wardrobe = await this.wardrobeRepository.findOne({ id: wardrobeId })
      if (!wardrobe) return response({}, true, HTTP_RESPONSE.WARDROBE.WARDROBE_NOT_EXIST)
      if (wardrobe.userId !== userId) return response({}, true, HTTP_RESPONSE.AUTHORIZATION.NO_ACCESS)
      const newWardrobe = await this.wardrobeRepository.updateOne(wardrobe, rest)
      return response(newWardrobe, false, HTTP_RESPONSE.WARDROBE.CREATED_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListWardrobe(req: Request, params: GetListWardrobeDTO) {
    try {
      const userId = req.user.id
      const wardrobes = await this.wardrobeRepository.getListWardrobe(params, userId)
      return response(wardrobes, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
