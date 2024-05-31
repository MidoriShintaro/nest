import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class VoucherDto {
  
  @IsString()
  @IsOptional()
  @MaxLength(7, {message:'code must be have 7 characters long'})
  code: string;

  @IsNumber()
  @IsOptional()
  value: Number;

  @IsString()
  @IsOptional()
  type: string;


  @IsOptional()
  productIds: string[];


  @IsOptional()
  userIds: string[];

}

export const VoucherSchema = SchemaFactory.createForClass(VoucherDto);
