import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CartDTO{
    @IsNumber()
    @IsOptional()
    quantity: number;

    @IsNumber()
    @IsOptional()
    price_per_unit: number;

    @IsNumber()
    @IsOptional()
    total_price: number;

    @IsDate()
    @IsOptional()
    created_at:Date;

    @IsNumber()
    @IsNotEmpty()
    user_id:string;

    @IsArray()
    @IsNotEmpty()
    products_id:string[];
    

    


    
    



}