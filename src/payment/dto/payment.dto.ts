import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PaymentDto{

    @IsString()
    @IsNotEmpty()
    method:string;

    @IsNumber()
    @IsNotEmpty()
    value:number;


    
    
}