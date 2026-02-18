import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { PackageEntity } from './package.entity'

@Injectable()
export class PackageRepository extends BaseRepository<PackageEntity> {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>
  ) {
    super(packageRepository)
  }
}
