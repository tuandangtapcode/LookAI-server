import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/common/const/http-response'
import { response } from 'src/common/helper/common'
import { AIService } from 'src/modules/ai/ai.service'
import { ItemTypeRepository } from '../item-type/item-type.repository'
import { AnalyzeWardrobeImageDTO } from './dto/analyze-wardrobe-image.dto'
import { CreateWardrobeDTO } from './dto/create-wardrobe.dto'
import { GetListWardrobeDTO } from './dto/get-list-wardrobe.dto'
import { GetQuantityWardrobeDTO } from './dto/get-quantity-wardrobe.dto'
import { UpdateWardrobeDTO } from './dto/update-wardrobe.dto'
import { WardrobeRepository } from './wardrobe.repository'

@Injectable()
export class WardrobeService {
  constructor(
    private readonly wardrobeRepository: WardrobeRepository,
    private readonly itemTypeRepository: ItemTypeRepository,
    private readonly aiService: AIService
  ) {}

  async createWardrobe(req: Request, body: CreateWardrobeDTO) {
    const userId = req.user.id

    const newWardrobe = await this.wardrobeRepository.insertOne({
      ...body,
      userId
    })

    return response(newWardrobe, false, HTTP_RESPONSE.WARDROBE.CREATED_SUCCESS)
  }

  async updateWardrobe(req: Request, body: UpdateWardrobeDTO) {
    const userId = req.user.id
    const { wardrobeId, ...rest } = body

    const wardrobe = await this.wardrobeRepository.findOne({ id: wardrobeId, userId })
    if (!wardrobe) return response({}, true, HTTP_RESPONSE.WARDROBE.WARDROBE_NOT_EXIST)

    const newWardrobe = await this.wardrobeRepository.updateOne(wardrobe, rest)

    return response(newWardrobe, false, HTTP_RESPONSE.WARDROBE.UPDATED_SUCCESS)
  }

  async getListWardrobe(req: Request, params: GetListWardrobeDTO) {
    const userId = req.user.id

    const wardrobes = await this.wardrobeRepository.getListWardrobe(params, userId)

    return response(wardrobes, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async getQuantity(params: GetQuantityWardrobeDTO, req: Request) {
    const userId = req.user.id

    const result = await this.wardrobeRepository.getQuantity(params, userId)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async analyzeWardrobeImage(body: AnalyzeWardrobeImageDTO) {
    const { image, itemCategory } = body

    const itemTypes = await this.itemTypeRepository.findMany({ category: itemCategory })
    if (!itemTypes.length) return response({}, true, HTTP_RESPONSE.WARDROBE.ITEM_TYPE_NOT_DETECTED)

    const result = await this.aiService.analyzeWardrobeImage(image, itemTypes)
    if (!result.isClothing) return response({}, true, HTTP_RESPONSE.WARDROBE.IMAGE_NOT_CLOTHING)
    if (!result.itemTypeId) return response({}, true, HTTP_RESPONSE.WARDROBE.ITEM_TYPE_NOT_DETECTED)

    return response(
      {
        itemTypeId: result.itemTypeId,
        name: result.itemTypeName,
        color: result.color,
        size: result.size
      },
      false,
      HTTP_RESPONSE.WARDROBE.ANALYZE_IMAGE_SUCCESS
    )
  }
}
