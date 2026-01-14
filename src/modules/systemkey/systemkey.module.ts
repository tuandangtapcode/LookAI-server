import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemkeyController } from './systemkey.controller'
import { SystemkeyEntity } from './systemkey.entity'
import { SystemkeyRepository } from './systemkey.repository'
import { SystemkeyService } from './systemkey.service'

@Module({
  imports: [TypeOrmModule.forFeature([SystemkeyEntity])],
  controllers: [SystemkeyController],
  providers: [SystemkeyService, SystemkeyRepository]
})
export class SystemkeyModule {}
