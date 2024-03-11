import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class OrderdetailDto{
   

    @IsNumber()
    @IsNotEmpty()
    quantity:number;
    
    @IsString()
    @IsNotEmpty()
    userId:string;

    @IsString()
    @IsNotEmpty()
    ProductId:string;

    @IsString()
    @IsOptional()
    OrderId:string;

    @IsOptional()
    UnitPrice:Number;

}