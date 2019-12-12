import { IsNotEmpty, IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class AuthenticateEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @Length(2, 25)
  displayName: string;
}
