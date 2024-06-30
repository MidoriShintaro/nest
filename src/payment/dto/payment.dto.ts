import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PaymentDto{

    @IsString()
    @IsEnum(['MOMO', 'BANK','PAYBACK'])
    method:string;

    



    @IsNotEmpty()
    orderId:string;

    
    @IsNumber()
    @IsOptional()
    shipValue:number;


    
    
}