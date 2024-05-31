import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CartDto {
  @IsString()
  @IsOptional()
  user: string;

  @IsString()
  @IsOptional()
  product: string;

  @IsNumber()
  quantity: number;
}
