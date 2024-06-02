import { IsOptional, IsString } from 'class-validator';
export class OrderDto {


  @IsOptional()
  carts: string[];

  @IsOptional()
  user: string;


}
