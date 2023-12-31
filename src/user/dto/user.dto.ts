import { IsEmail, IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';
import { UserRole } from '../entity/user.entity';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Min(8)
  password: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsEnum(UserRole)
  role: string;
}
