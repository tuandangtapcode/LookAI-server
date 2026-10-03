import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AIModule } from '../ai/ai.module'
import { UserSubscriptionModule } from '../user-subscription/user-subscription.module'
import { WardrobeModule } from '../wardrobe/wardrobe.module'
import { OutfitAdviceController } from './outfit-advice.controller'
import { OutfitAdviceEntity } from './outfit-advice.entity'
import { OutfitAdviceRepository } from './outfit-advice.repository'
import { OutfitAdviceService } from './outfit-advice.service'

@Module({
  imports: [TypeOrmModule.forFeature([OutfitAdviceEntity]), WardrobeModule, UserSubscriptionModule, AIModule],
  controllers: [OutfitAdviceController],
  providers: [OutfitAdviceService, OutfitAdviceRepository],
  exports: [OutfitAdviceRepository]
})
export class OutfitAdviceModule {}
