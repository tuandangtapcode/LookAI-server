import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'

class SubKeyDTO {
  @IsNumber()
  keyValue: number

  @IsString()
  keyName: string
}

export class CreateSystemkeyDTO {
  @IsNotEmpty()
  @IsString()
  keyName: string

  @ValidateNested({ each: true })
  @Type(() => SubKeyDTO)
  subKeys: SubKeyDTO[]
}
