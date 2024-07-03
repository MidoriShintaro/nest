import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ProductDto } from "src/product/dto/product.dto";

export class OrderdetailDto{
   

    @IsNumber()
    @IsOptional()
    quantity:number;
    
    @IsString()
    @IsOptional()
    userId:string;

    @IsString()
    @IsOptional()
    productId:string;

    @IsString()
    @IsOptional()
    orderId:string;

    @IsOptional()
    unitPrice:Number;

    @IsOptional()
    product:ProductDto;

}