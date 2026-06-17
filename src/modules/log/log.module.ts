import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogController } from './log.controller'
import { LogEntity } from './log.entity'
import { LogRepository } from './log.repository'
import { LogService } from './log.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LogController],
  providers: [LogService, LogRepository],
  exports: [LogRepository]
})
export class LogModule {}
