import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class Guarantee{
   
    @IsDate()
    @IsNotEmpty()
    guaranteedate:Date;

    @IsNumber()
    @IsOptional()
    timeguarantee:number;

    @IsBoolean()
    @IsNotEmpty()
    guarantee:boolean;

    @IsArray()
    @IsNotEmpty()
    products_id:number[];
}