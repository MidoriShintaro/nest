import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderdetailDto {
  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  productId: string;

  @IsString()
  @IsOptional()
  orderId: string;

  @IsOptional()
  unitPrice: number;
}
