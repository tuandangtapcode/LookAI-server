import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AIModule } from '../ai/ai.module'
import { ItemTypeModule } from '../item-type/item-type.module'
import { WardrobeController } from './wardrobe.controller'
import { WardrobeEntity } from './wardrobe.entity'
import { WardrobeRepository } from './wardrobe.repository'
import { WardrobeService } from './wardrobe.service'

@Module({
  imports: [TypeOrmModule.forFeature([WardrobeEntity]), ItemTypeModule, AIModule],
  controllers: [WardrobeController],
  providers: [WardrobeService, WardrobeRepository],
  exports: [WardrobeRepository]
})
export class WardrobeModule {}
