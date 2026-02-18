import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { OutfitAdviceEntity } from './outfit-advice.entity'
import { ICreateOutfitAdvice } from './outfit-advice.interface'

@Injectable()
export class OutfitAdviceRepository extends BaseRepository<OutfitAdviceEntity> {
  constructor(
    @InjectRepository(OutfitAdviceEntity)
    private readonly outfitAdviceRepository: Repository<OutfitAdviceEntity>
  ) {
    super(outfitAdviceRepository)
  }

  async createOutfitAdvice(body: ICreateOutfitAdvice, userSubscriptionId: string) {
    return this.outfitAdviceRepository.manager.transaction(async (manager) => {
      const userSubscriptionRepo = manager.getRepository(UserSubscriptionEntity)
      const outfitAdviceRepo = manager.getRepository(OutfitAdviceEntity)
      const createOutfitAdvice = outfitAdviceRepo.create(body)
      const createdOutfitAdvice = await outfitAdviceRepo.save(createOutfitAdvice)
      await userSubscriptionRepo.update(userSubscriptionId, {
        usedQuota: () => 'used_quota + 1'
      })
      return createdOutfitAdvice
    })
  }
}
