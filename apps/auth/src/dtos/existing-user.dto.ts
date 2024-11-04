import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ExistingUserDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
