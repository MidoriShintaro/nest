import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsEnum(['ZALOPAY', 'PAYLATER'])
  method: string;

  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsOptional()
  shipValue: number;
}
