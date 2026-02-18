import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PackageController } from './package.controller'
import { PackageEntity } from './package.entity'
import { PackageRepository } from './package.repository'
import { PackageService } from './package.service'

@Module({
  imports: [TypeOrmModule.forFeature([PackageEntity])],
  controllers: [PackageController],
  providers: [PackageService, PackageRepository],
  exports: [PackageRepository]
})
export class PackageModule {}
