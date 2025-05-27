import { IsEmail, IsIn, IsOptional, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;
  
  @MaxLength(20)
  name: string;

  @MinLength(6)
  password: string;
  
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';
}
