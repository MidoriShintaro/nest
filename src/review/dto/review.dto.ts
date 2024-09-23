import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReviewDTO {
  @IsString()
  @IsOptional()
  comment: string;

  //   @IsString()
  //   @IsOptional()
  //   image: string;

  @IsNumber()
  @IsOptional()
  rate: number;

  @IsString()
  @IsOptional()
  productId: string;
}
