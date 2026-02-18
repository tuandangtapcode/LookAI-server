import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ItemTypeController } from './item-type.controller'
import { ItemTypeEntity } from './item-type.entity'
import { ItemTypeRepository } from './item-type.repository'
import { ItemTypeService } from './item-type.service'

@Module({
  imports: [TypeOrmModule.forFeature([ItemTypeEntity])],
  controllers: [ItemTypeController],
  providers: [ItemTypeService, ItemTypeRepository]
})
export class ItemTypeModule {}
