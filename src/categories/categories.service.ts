import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { CategoriesDTO } from './dto/category.dto';
import { Category } from './entity/Categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async update(
    updateCategoryDto: CategoriesDTO,
    id: string,
  ): Promise<Category> {
    const idObject = new Types.ObjectId(id);
    const oldCategory = await this.categoryModel.findById(idObject).exec();
    if (!oldCategory) {
      throw new Error('Category not found!!!');
    }
    oldCategory.categoryName = updateCategoryDto.categoryName;
    oldCategory.code = updateCategoryDto.code;

    return await oldCategory.save();
  }

  async delete(id :string) {

      const session: ClientSession = await this.categoryModel.startSession();
      session.startTransaction();
      console.error('idNumber:', id);

      const obejctId = new Types.ObjectId(id);

      console.error('objcetID', obejctId);

      const oldCategory = await this.categoryModel.findById(obejctId).exec();
      if (!oldCategory) {
        throw new Error('Category not found!!!');
      }

      try {
        const products = oldCategory.products;
        console.error('old products', products);
        const otherCategory = await this.categoryModel
          .findOne({ categoryName: 'other' })
          .exec();
        const productOtherCategory = otherCategory.products;
        const reustlconcat = productOtherCategory.concat(products);
        console.error('products other', reustlconcat);
        otherCategory.products = reustlconcat;

        otherCategory.save();

        const result = await oldCategory.deleteOne({ _id: obejctId });
        if (result.deletedCount == 0) {
          throw Error('No category is deleted');
        }
        session.commitTransaction();
        session.endSession();
      } catch (error) {
        console.log(error);
        session.abortTransaction();
        session.endSession();
      }
    
  }
  async findByName(categoryName: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ categoryName: categoryName })
      .exec();
    console.error('result', category);

    if (category === null) {
      Logger.error('Category not found');
      return null;
    }
    return category;
  }
  async findByNameReturnId(categoryName: string): Promise<string> {
    const category = await this.categoryModel
      .findOne({ categoryName: categoryName })
      .exec();
    console.error('result', category);

    if (category === null) {
      Logger.error('Category not found');
      return null;
    }

    return category._id.toHexString();
  }
  async findByIdReturnName(categoryId: string): Promise<string> {
    const categoryObjectId = new Types.ObjectId(categoryId);
    console.error('result categoryId', categoryObjectId);
    console.error('result categoryId', categoryId);


    const category = await this.categoryModel.findById(categoryObjectId).exec();
    console.error('result categoryId', categoryId);

    console.error('result category', category);

    if (category === null) {
      Logger.error('Category not found');
      return null;
    }
    const categoryName = category.categoryName;
    console.error('id is:', categoryName);
    return categoryName.toString();
  }
  async deleteOldProductAndAddnewProduct(
    oldName: string,
    newName: string,
    productId: string,
  ): Promise<boolean> {
    try {
      const oldCategory = this.categoryModel.findOne({ categoryName: oldName });
      const newCategory = this.categoryModel.findOne({ categoryName: newName });
      const oldProduct = (await oldCategory).products;
      const oldIndex = oldProduct.indexOf(productId);
      oldProduct.splice(oldIndex, 1);

      const newProduct = (await newCategory).products;
      newProduct.push(productId);
      (await oldCategory).products = oldProduct;
      (await newCategory).products = newProduct;
      (await oldCategory).save();
      (await newCategory).save();
      return true;
    } catch (Error) {
      return false;
    }
  }
  async findNameAndCode(createCategoryDto: CategoriesDTO): Promise<boolean> {
    const category = await this.categoryModel
      .findOne({ categoryName: createCategoryDto.categoryName })
      .exec();
    if (!category) {
      Logger.error('Category not found');
      return false;
    }
    return true;
  }

  async create(createCategoryDto: CategoriesDTO): Promise<Category> {
    const exists = await this.findNameAndCode(createCategoryDto);
    if (exists) {
      Logger.error('Category already exists');
      return null;
    }

    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }
}
