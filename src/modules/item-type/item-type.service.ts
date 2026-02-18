import { Injectable, InternalServerErrorException } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { Not } from 'typeorm'
import { CreateItemTypeDTO } from './dto/create-item-type.dto'
import { UpdateItemTypeDTO } from './dto/update-item-type.dto'
import { ItemTypeRepository } from './item-type.repository'

@Injectable()
export class ItemTypeService {
  constructor(private readonly itemTypeRepository: ItemTypeRepository) {}

  async createItemType(body: CreateItemTypeDTO) {
    try {
      const { name, category } = body
      const itemType = await this.itemTypeRepository.findOne({ name, category })
      if (itemType) return response({}, true, HTTP_RESPONSE.ITEM_TYPE.ITEM_TYPE_EXIST)
      const newItemType = await this.itemTypeRepository.insertOne(body)
      return response(newItemType, false, HTTP_RESPONSE.ITEM_TYPE.CREATED_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateItemType(body: UpdateItemTypeDTO) {
    try {
      const { name, category, itemTypeId } = body
      const itemType = await this.itemTypeRepository.findOne({ id: itemTypeId })
      if (!itemType) return response({}, true, HTTP_RESPONSE.ITEM_TYPE.ITEM_TYPE_NOT_EXIST)
      const itemTypeExistName = await this.itemTypeRepository.findOne({
        name,
        id: Not(itemTypeId),
        category
      })
      if (itemTypeExistName) return response({}, true, HTTP_RESPONSE.ITEM_TYPE.ITEM_TYPE_EXIST)
      const updatedItemType = await this.itemTypeRepository.updateOne(itemType, body)
      return response(updatedItemType, false, HTTP_RESPONSE.ITEM_TYPE.UPDATED_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListItemType() {
    try {
      const result = await this.itemTypeRepository.findMany({})
      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
