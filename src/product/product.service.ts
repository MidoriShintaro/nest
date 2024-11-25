import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entity/Product.entity';
import { Model, Types } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entity/Categories.entity';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
// import { TreeRepository } from 'typeorm';
// import { ConfigurableModuleClass } from '@nestjs/cache-manager/dist/cache.module-definition';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private categoryService: CategoriesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async update(
    updateProductDto: ProductDto,
    id: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const objectId = new Types.ObjectId(id);

    const oldProduct = await this.productModel.findById(objectId).exec();

    if (!oldProduct) {
      throw new Error('old Prodcut not found!!!');
    }
    const updateDetails = updateProductDto;

    if (updateDetails.description != null) {
      oldProduct.description = updateDetails.description;
    }
    oldProduct.productName = updateDetails.productName;
    oldProduct.size = updateDetails.size;
    oldProduct.color = updateDetails.color;
    oldProduct.price = updateDetails.price;

    if (updateDetails.categoryName != null) {
      const oldCategoryName = this.categoryService.findByIdReturnName(
        oldProduct.category,
      );

      if (updateDetails.categoryName != (await oldCategoryName).toString()) {
        try {
          const result = this.categoryService.deleteOldProductAndAddNewProduct(
            (await oldCategoryName).toString(),
            updateDetails.productName,
            updateProductDto.id,
          );
          console.error(result);
        } catch (Error) {
          throw Error;
        }
      }
    }
    if (updateDetails.brand != null) {
      oldProduct.brand = updateDetails.brand;
    }
    if (file != null) {
      const data = await this.cloudinaryService.uploadImage(file, 'product');
      oldProduct.image = data.secure_url;
    }
    if (updateDetails.cartId != null) {
    }
    await oldProduct.save();
    return 'Product updated successfully';
  }

  async delete(id: string): Promise<string> {
    try {
      const objectId = new Types.ObjectId(id);
      const oldProduct = await this.productModel.findById(objectId).exec();
      if (!oldProduct) {
        throw new Error('Product not found!!!');
      }
      const categoriesToUpdate = await this.categoryModel.findOne({
        products: id,
      });
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
      return 'Delete product successfully';
    } catch (error) {
      console.log(error);
      // Handle error or rethrow it
    }
  }

  async findNameAndCode(createProductDto: ProductDto): Promise<boolean> {
    const product = await this.productModel
      .findOne({ category: createProductDto.productName })
      .exec();
    if (!product) {
      Logger.error('Category not found');
      return false;
    }
    return true;
  }

  async create(
    createProductDto: ProductDto,
    image: Express.Multer.File,
  ): Promise<string> {
    const createProduct = createProductDto;

    const category = await this.categoryService.findByName(
      createProductDto.categoryName,
    );
    const id = await this.categoryService.findByNameReturnId(
      createProductDto.categoryName,
    );
    const data = await this.cloudinaryService.uploadImage(image, 'product');
    console.log(data);
    const createdProduct = new Product();
    createdProduct.productName = createProduct.productName;
    createdProduct.size = createProduct.size;
    createdProduct.color = createProduct.color;
    createdProduct.price = createProduct.price;
    createdProduct.description = createProduct.description;
    createdProduct.image = data.secure_url;
    createdProduct.category = id;
    createdProduct.brand = createProduct.brand;

    const createdProducts = new this.productModel(createdProduct);

    const saveProduct = await createdProducts.save();
    category.products.push(saveProduct._id.toHexString());
    const savedCategory = new this.categoryModel(category);
    savedCategory.save();
    return 'Product created successfully';
  }

  async findAll(): Promise<Product[]> {
    return this.productModel
      .find()
      .populate({ path: 'category', select: 'categoryName' })
      .populate({ path: 'reviews', select: 'rate' })
      .exec();
  }
  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate({ path: 'category', select: 'categoryName' })
      .populate({ path: 'reviews', select: 'rate' });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getProductByCategory(categoryName: string): Promise<Product[]> {
    const category = await this.categoryModel.findOne({ categoryName });
    if (!category) throw new NotFoundException('Category not found');

    const products = await this.productModel
      .find({ category: category.id })
      .populate({ path: 'category', select: 'categoryName' })
      .populate({ path: 'reviews', select: 'rate' });
    if (products.length <= 0) throw new NotFoundException('Products not found');

    return products;
  }

  async filteredProductByCategory(
    categoryName: string,
    filter: string,
  ): Promise<Product[]> {
    const category = await this.categoryModel.findOne({ categoryName });
    if (!category) throw new NotFoundException('Category not found');
    if (filter.includes('price')) {
      return await this.productModel
        .find({ category: category.id })
        .sort({ price: filter === 'pricelowtohight' ? 1 : -1 })
        .populate({ path: 'reviews', select: 'rate' });
    } else if (filter.includes('rate')) {
      return await this.productModel.find({ category: category.id }).populate({
        path: 'reviews',
        select: 'rate',
        options: { sort: { rate: filter === 'highrated' ? -1 : 1 } },
      });
    } else {
      return await this.productModel
        .find({ category: category.id })
        .populate({ path: 'reviews', select: 'rate' });
    }
  }
}
