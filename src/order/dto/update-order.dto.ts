import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDTO {
  @IsOptional()
  @IsEnum(['NOTPAY', 'EXPIRES', 'CANCEL', 'PAID'])
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  orderCode: string;
}
