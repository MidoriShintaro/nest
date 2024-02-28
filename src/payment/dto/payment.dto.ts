import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Payment{

    @IsString()
    @IsNotEmpty()
    method:string;

    @IsNumber()
    @IsNotEmpty()
    value:number;

    @IsDate()
    @IsNotEmpty()
    date:Date;

    
    
}