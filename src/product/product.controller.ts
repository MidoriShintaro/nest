import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/Product.entity';
import { ProductDto } from './dto/product.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() productDto: ProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return this.productService.create(productDto, image);
  }

  @Get()
  async getAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    return await this.productService.getProduct(id);
  }

  @Get('/category/:categoryName')
  async getProductByCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<Product[]> {
    return await this.productService.getProductByCategory(categoryName);
  }

  @Post('/category')
  async filteredProductByCategory(@Body() options: any): Promise<Product[]> {
    return await this.productService.filteredProductByCategory(
      options.categoryName,
      options.filter,
    );
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() productDto: ProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.productService.update(productDto, id, file);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.productService.delete(id);
  }
}
