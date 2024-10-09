import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsEnum(['ZALOPAY'])
  method: string;

  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsOptional()
  shipValue: number;
}
