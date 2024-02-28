import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Orderdetail{
    @IsNumber()
    @IsNotEmpty()
    unitprice:number;

    @IsNumber()
    @IsNotEmpty()
    quantity:number;

    

}