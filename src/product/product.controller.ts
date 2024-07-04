import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/Product.entity';
import { ProductDto } from './dto/product.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { DeleteDTO } from './dto/deleteDTO.dto';

@Controller('/api/product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() productDto: ProductDto): Promise<Product> {
    return this.productService.create(productDto);
  }
  @Get()
  async getAll(): Promise<Product[]> {
    return this.productService.findAll();
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() productDto: ProductDto,
  ): Promise<Product> {
  
    return this.productService.update(productDto, id);
  }

  @Delete()
  async delete(@Body() deleteDto:DeleteDTO) {
    
    console.error('products', deleteDto.ids);
    await this.productService.delete(deleteDto.ids);
  }
}
