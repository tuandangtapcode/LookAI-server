import { Injectable, InternalServerErrorException } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { Not } from 'typeorm'
import { CreatePackageDto } from './dto/create-package.dto'
import { GetListPackageDto } from './dto/get-list-package.dto'
import { UpdatePackageDto } from './dto/update-package.dto'
import { PackageRepository } from './package.repository'

@Injectable()
export class PackageService {
  constructor(private readonly packageRepository: PackageRepository) {}

  async createPackage(body: CreatePackageDto) {
    try {
      const { name } = body
      const packageByName = await this.packageRepository.findOne({ name })
      if (packageByName) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_EXIST)
      const newPackage = await this.packageRepository.insertOne(body)
      return response(newPackage, false, HTTP_RESPONSE.PACKAGE.CREATED_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updatePackage(body: UpdatePackageDto) {
    try {
      const { packageId, name } = body
      const packageById = await this.packageRepository.findOne({ id: packageId })
      if (!packageById) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
      const packageByName = await this.packageRepository.findOne({ name, id: Not(packageId) })
      if (packageByName) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_EXIST)
      const updatedPackage = await this.packageRepository.updateOne(packageById, body)
      return response(updatedPackage, false, HTTP_RESPONSE.PACKAGE.UPDATED_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListPackage(params: GetListPackageDto) {
    try {
      let options = {}
      if (params.isActive) {
        options = { ...options, isActive: params.isActive }
      }
      const result = (await this.packageRepository.findMany(options)).sort((a, b) => a.price - b.price)
      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getDetailPackage(packageId: string) {
    try {
      const packageById = await this.packageRepository.findOne({ id: packageId })
      if (!packageById) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
      return response(packageById, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
