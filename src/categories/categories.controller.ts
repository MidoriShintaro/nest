import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDTO } from './dto/category.dto';
import { Category } from './entity/Categories.entity';

@Controller('/api/categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  async create(@Body() categoryDto: CategoriesDTO): Promise<Category> {
    return this.categoryService.create(categoryDto);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() categoryDto: CategoriesDTO,
  ): Promise<Category> {
    return this.categoryService.update(categoryDto, id);
  }
  @Delete()
  async delete(@Body() body: any) {
    const ids: string[] = body.ids;

    this.categoryService.delete(ids);
  }

  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
