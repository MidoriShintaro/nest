import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class BrandDto{

    @IsString()
    @IsNotEmpty()
    brandname: string;

    @IsArray()
    @IsNotEmpty()
    products_id: Number[];


}