import { IsOptional, IsString } from 'class-validator';
export class OrderDto {


  @IsOptional()
  cartIds: string[];

  @IsOptional()
  user: string;


}
