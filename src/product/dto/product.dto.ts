import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductDto {

  id: string;
  
  @IsString()
  @IsNotEmpty()
  productname: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  numberstock: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  viewcount: number;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsNumber()
  @IsOptional()
  width: number;

  @IsNumber()
  @IsOptional()
  length: number;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsString()
  @IsOptional()
  image: string;

  
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsOptional()
  brand: string;

  @IsNumber()
  @IsOptional()
  //@IsNotEmpty()
  Cart: string;

  
  @IsOptional()
  ids: string[];



}
