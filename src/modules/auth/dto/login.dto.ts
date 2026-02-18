import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string
}
