import { IsDate, IsNotEmpty, IsString } from "class-validator";
export class Order{

    @IsDate()
    @IsNotEmpty()
    orderdate:Date;

    @IsString()
    @IsNotEmpty()
    status:string;

    

}