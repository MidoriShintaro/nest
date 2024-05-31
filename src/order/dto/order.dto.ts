import { IsOptional, IsString } from 'class-validator';
export class OrderDto {
  @IsOptional()
  status: boolean;

  @IsOptional()
  orderdetailIds: string[];

  @IsString()
  @IsOptional()
  paymentId: string;
}
