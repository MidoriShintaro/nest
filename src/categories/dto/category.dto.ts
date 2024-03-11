import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CategoriesDTO{


  
    id:number;
    
    @IsString()
    @IsNotEmpty()
    categoryname:string;

    @IsString()
    @IsNotEmpty()
    code:string;

    @IsArray()
    @IsOptional()
    products_id: string[];

    ids:string[];
    

}