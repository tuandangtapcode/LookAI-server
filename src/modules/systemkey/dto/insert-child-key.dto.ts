import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class InsertChildkeyDTO {
  @IsUUID()
  @IsNotEmpty()
  parentId: string

  @IsString()
  @IsNotEmpty()
  keyName: string
}
