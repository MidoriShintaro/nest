import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entity/user.entity';

export class updateDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: string;
}
