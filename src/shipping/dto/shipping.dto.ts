import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ReviewDTO{

    @IsDate()
    @IsNotEmpty()
    date:Date;

    @IsString()
    @IsNotEmpty()
    method:string;

    @IsNumber()
    @IsNotEmpty()
    value:number;

    

    

    
}