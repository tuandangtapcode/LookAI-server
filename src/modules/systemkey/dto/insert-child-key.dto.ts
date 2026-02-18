import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class InsertChildkeyDTO {
  @IsNotEmpty()
  @IsUUID()
  parentId: string

  @IsNotEmpty()
  @IsString()
  keyName: string
}
