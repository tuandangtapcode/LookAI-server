import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreatePackageDto } from './create-package.dto'

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @IsNotEmpty()
  @IsUUID()
  packageId: string
}
