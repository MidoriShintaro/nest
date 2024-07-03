import { IsOptional, IsString } from 'class-validator';
import { OrderdetailDto } from 'src/orderdetail/dto/orderdetail.dto';
export class OrderDto {


  @IsOptional()
  cartIds: string[];

  @IsOptional()
  user: string;

  @IsOptional()
  address: string;
  
  @IsOptional()
  zipcode: string;


}
