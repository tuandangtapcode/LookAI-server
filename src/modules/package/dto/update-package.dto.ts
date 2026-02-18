import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreatePackageDto } from './create-package.dto'

export class UpdatePackageDto extends CreatePackageDto {
  @IsNotEmpty()
  @IsUUID()
  packageId: string
}
