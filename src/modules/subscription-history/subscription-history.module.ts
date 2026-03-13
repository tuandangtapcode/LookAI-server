import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionHistoryEntity } from './subscription-history.entity'
import { SubscriptionHistoryRepository } from './subscription-history.repository'

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionHistoryEntity])],
  providers: [SubscriptionHistoryRepository],
  exports: [SubscriptionHistoryRepository]
})
export class SubscriptionHistoryModule {}
