import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entity/Product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoriesModule } from 'src/categories/categories.module';
import {
  Category,
  CategorySchema,
} from 'src/categories/entity/Categories.entity';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CategoriesModule,
    CloudinaryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
