import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WardrobeController } from './wardrobe.controller'
import { WardrobeEntity } from './wardrobe.entity'
import { WardrobeRepository } from './wardrobe.repository'
import { WardrobeService } from './wardrobe.service'

@Module({
  imports: [TypeOrmModule.forFeature([WardrobeEntity])],
  controllers: [WardrobeController],
  providers: [WardrobeService, WardrobeRepository],
  exports: [WardrobeRepository]
})
export class WardrobeModule {}
