import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PaymentDto{

    @IsString()
    @IsEnum(['MOMO', 'BANK'])
    method:string;

    @IsNumber()
    @IsNotEmpty()
    value:number;



    @IsNotEmpty()
    orderId:string;

    
    @IsNumber()
    @IsOptional()
    shipvalue:number;


    
    
}