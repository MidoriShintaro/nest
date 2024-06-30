import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entity/Product.entity';
import { Model, Types } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entity/Categories.entity';
import { TreeRepository } from 'typeorm';
import { ConfigurableModuleClass } from '@nestjs/cache-manager/dist/cache.module-definition';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private categoryService: CategoriesService,
  ) {}

  async update(updateProductDto: ProductDto, id: string): Promise<Product> {
   
    const objectId = new Types.ObjectId(id);
   
    const oldProduct = await this.productModel.findById(objectId).exec();
   
    if (!oldProduct) {
      throw new Error('old Prodcut not found!!!');
    }
    const {
      productName,
      length,
      weight,
      width,
      height,
      size,
      color,
      numberStock,
      price,
      description,
      image,
      categoryName,
      brand,
      cartId,
    } = updateProductDto;
    
   
   
    if (height != null) {
      oldProduct.height = height;
    }
    if (length != null) {
      oldProduct.length = length;
    }
    if (weight != null) {
      oldProduct.weight = weight;
    }
    if (width != null) {
      oldProduct.width = width;
    }
    if (numberStock != null) {
      oldProduct.numberStock = numberStock;
    }
    
    if (description != null) {
      oldProduct.description = description;
    }
    oldProduct.productName = productName;
    oldProduct.size = size;
    oldProduct.color = color;
    oldProduct.price = price;

    console.log('erro', oldProduct);
    if (categoryName != null) {
      const oldCategoryName = this.categoryService.findByIdReturnName(
        oldProduct.category,
      );
    
      if (categoryName != (await oldCategoryName).toString()) {
        try {
          const result = this.categoryService.deleteOldProductAndAddnewProduct(
            (await oldCategoryName).toString(),
            productName,
            updateProductDto.id,
          );
          console.error(result);
        } catch (Error) {
          throw Error;
        }
      }
    }
    if (brand != null) {
    }
    if (image != null) {
    }
    if (cartId != null) {
    }
   const result = await oldProduct.save();
   console.log("result", result);
    return result;
  }

  async delete(ids: string[]) {
    for (const id of ids) {
      try {
        const objectId = new Types.ObjectId(id);
        const oldProduct = await this.productModel.findById(objectId).exec();
        if (!oldProduct) {
          throw new Error('Product not found!!!');
        }
        const categoriesToUpdate = await this.categoryModel.findOne({
          Products: id,
        });
        console.error('categoryUpdate', categoriesToUpdate);
        // Update each category to remove the reference to the deleted product
        categoriesToUpdate.products.splice(
          categoriesToUpdate.products.indexOf(
            (await this.productModel.findById(id))._id.toHexString(),
          ),
          1,
        );
        await categoriesToUpdate.save();
        const result = await oldProduct.deleteOne();
        if (result.deletedCount === 0) {
          throw new Error('No product is deleted');
        }
      } catch (error) {
        console.log(error);
        // Handle error or rethrow it
      }
    }
  }

  async findNameAndCode(createProductDto: ProductDto): Promise<boolean> {
    const product = await this.productModel
      .findOne({ categoryname: createProductDto.productName })
      .exec();
    if (!product) {
      Logger.error('Category not found');
      return false;
    }
    return true;
  }

  async create(createProductDto: ProductDto): Promise<Product> {
    const {
      productName,
      length,
      weight,
      width,
      height,
      size,
      color,
      numberStock,
      price,
      description,
      viewCount,
      image,
      categoryName,
      brand,
      cartId,
    } = createProductDto;
    const exists = await this.findNameAndCode(createProductDto);
    if (exists) {
      Logger.error('Category already exists');
      return null;
    }

    const category = await this.categoryService.findByName(
      createProductDto.categoryName,
    );
    console.error('New Product', createProductDto);
    console.error('Category ..', category);

    const createdProduct = new Product();
    createdProduct.productName = productName;
    createdProduct.size = size;
    createdProduct.color = color;
    createdProduct.price = price;
    createdProduct.numberStock = numberStock;
    createdProduct.description = description;
    createdProduct.viewCount = viewCount;
    createdProduct.image = image;
    createdProduct.length = length;

    createdProduct.width = width;

    createdProduct.height = height;
    createdProduct.weight = weight;

    var id = await this.categoryService.findByNameReturnId(
      createProductDto.categoryName,
    );
    console.error('categoryName', createProductDto.categoryName);
    console.log('id type', typeof id);
    createdProduct.category = id;
    //createdProduct.Brand = brand;
    //createdProduct.Cart = Cart;

    const createdProducts = new this.productModel(createdProduct);

    const saveProduct = await createdProducts.save();
    console.error('Product error', saveProduct);
    category.products.push(saveProduct._id.toHexString());
    const savedCategory = new this.categoryModel(category);
    savedCategory.save();
    console.log('Category after push', savedCategory);
    return saveProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }
}
