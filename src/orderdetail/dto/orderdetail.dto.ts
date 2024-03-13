import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class OrderdetailDto{
   

    @IsNumber()
    @IsOptional()
    quantity:number;
    
    @IsString()
    @IsOptional()
    userId:string;

    @IsString()
    @IsOptional()
    ProductId:string;

    @IsString()
    @IsOptional()
    OrderId:string;

    @IsOptional()
    UnitPrice:Number;

}