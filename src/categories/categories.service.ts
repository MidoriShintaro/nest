import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { privateDecrypt } from 'crypto';
import { Model, Types, Mongoose, ClientSession} from 'mongoose';
import { CategoriesDTO } from './dto/category.dto';
import { Category, CategoryDocument } from './entity/Categories.entity';
import { ObjectId } from 'typeorm';


@Injectable()
export class CategoriesService {

    constructor(@InjectModel (Category.name) private categoryModel: Model<Category>){}
  
    async update (updateCategoryDto: CategoriesDTO, id:string): Promise<Category>
    {
        const idObject = new Types.ObjectId(id);
        const oldCategory = await this.categoryModel.findById(idObject).exec();
        if(!oldCategory)
        {
            throw new Error('Category not found!!!');
        }
        oldCategory.categoryname = updateCategoryDto.categoryname;
        oldCategory.code = updateCategoryDto.code;


        return await oldCategory.save();
    }

    async delete (ids: string[])
    {
        for(const id of ids)
        {
            const session: ClientSession =await this.categoryModel.startSession();
        session.startTransaction();
        console.error('idNumber:',id)

        const obejctId =new  Types.ObjectId(id);
        
        console.error('objcetID',obejctId);

        const oldCategory = await this.categoryModel.findById(obejctId).exec();
        if(!oldCategory)
        {
            throw new Error('Category not found!!!');
        }
    
        
        
        try{
            const products =  oldCategory.Products;
            console.error('old products', products);
        const otherCategory = await this.categoryModel.findOne({categoryname:'other'}).exec();
        const productOtherCategory = otherCategory.Products;
       const reustlconcat =  productOtherCategory.concat(products);
        console.error('products other', reustlconcat);
        otherCategory.Products = reustlconcat;

        otherCategory.save();

            const result =  await oldCategory.deleteOne({_id:obejctId});
            if(result.deletedCount==0)
            {
                throw Error ('No category is deleted')
            }
            session.commitTransaction();
            session.endSession();

        }
        catch(error)
        {
            console.log(error);
            session.abortTransaction();
            session.endSession();
        }
        }
        
    }
    async findByName(categoryName: string): Promise<Category>{

        const category = await this.categoryModel.findOne({categoryname:categoryName}).exec();
        console.error('result',category)
       

        if(category===null)
        {
            Logger.error('Category not found');
            return null;
        }
        return category;
    }
    async findByNameReturnId(categoryName: string): Promise<string>{

        const category = await this.categoryModel.findOne({categoryname:categoryName}).exec();
        console.error('result',category)
       

        if(category===null)
        {
            Logger.error('Category not found');
            return null;
        }
     
               return category._id.toHexString();
    }
    async findByIdReturnName(categoryId: string): Promise<String>{
        const categoryObjectId = new Types.ObjectId(categoryId);
        const category = await this.categoryModel.findById(categoryObjectId).exec();
        console.error('result categoryId',categoryId)
       
        console.error('result category',category)
       

        if(category===null)
        {
            Logger.error('Category not found');
            return null;
        }
        const categoryName = category.categoryname; 
        console.error('id is:',categoryName);
               return categoryName.toString();
    }
    async deleteOldProductAndAddnewProduct(oldName:string, newName:string, productId: string): Promise<boolean> {
        try{

        const oldCategory = this.categoryModel.findOne({categoryname:oldName});
        const newCategory = this.categoryModel.findOne({categoryname:newName});
        const oldProduct = (await oldCategory).Products;
        const oldIndex = oldProduct.indexOf(productId);
        oldProduct.splice(oldIndex,1);

        const newProduct = (await newCategory).Products;
        newProduct.push(productId);
        (await oldCategory).Products = oldProduct;
        (await newCategory).Products = newProduct;
        (await oldCategory).save();
        (await newCategory).save();
        return true;
        }
        catch(Error)
        {
            return false;
        }
        
        
    }
    async findNameAndCode(createCategoryDto: CategoriesDTO): Promise<boolean> {
        const category = await this.categoryModel.findOne({ categoryname: createCategoryDto.categoryname }).exec();
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

    async findAll (): Promise<Category[]>
    {
     
        return this.categoryModel.find().exec();
    }
}
