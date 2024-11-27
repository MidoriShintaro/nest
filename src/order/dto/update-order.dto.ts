import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDTO {
  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  orderCode: string;
}
