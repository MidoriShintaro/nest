import { IsOptional } from 'class-validator';
export class OrderDto {
  @IsOptional()
  cartIds: string[];

  @IsOptional()
  user: string;

  @IsOptional()
  address: string;
  @IsOptional()
  zipCode: string;

  @IsOptional()
  city: string;
}
