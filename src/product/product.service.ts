import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./entity/Product.entity";
import { Model, Types } from "mongoose";
import { ProductDto } from "./dto/product.dto";
import { CategoriesService } from "src/categories/categories.service";
import { Category } from "src/categories/entity/Categories.entity";
import { TreeRepository } from "typeorm";
import { ConfigurableModuleClass } from "@nestjs/cache-manager/dist/cache.module-definition";

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>, 
                @InjectModel(Category.name) private categoryModel: Model<Category>
                ,private categoryService: CategoriesService) { }



    async update(updateProductDto: ProductDto, id:string): Promise<Product> {
        const objectId = new Types.ObjectId(id);
        const oldProduct = await this.productModel.findById(objectId).exec();
        if (!oldProduct) {
            throw new Error('old Prodcut not found!!!');
        }
        const {productname,length, weight, width,height, size, color, numberstock,price,description,viewcount,image,categoryName, brand,Cart} = updateProductDto ;
        if(productname!=null)
        {
            oldProduct.productname = productname;
        }
        if(size != null)
        {
            oldProduct.size = size;
        }
        if(color != null)
        {
            oldProduct.color = color;
        }
        if(height != null)
        {
            oldProduct.height = height;
        }
        if(length != null)
        {
            oldProduct.length = length;
        }
        if(weight != null)
        {
            oldProduct.weight = weight;
        }
        if(width != null)
        {
            oldProduct.width = width;
        }
        if(numberstock != null)
        {
            oldProduct.numberstock = numberstock;
        }
        if(price != null)
        {
            oldProduct.price = price;
        }
        if(description != null)
        {
            oldProduct.description = description;
        }
        if(viewcount != null)
        {
            oldProduct.viewcount = viewcount;
        }
        if(categoryName != null)
        {
            const oldCategoryName = this.categoryService.findByIdReturnName(oldProduct.Category);
            if(categoryName != (await oldCategoryName).toString())
            {   
                try{
                const result = this.categoryService.deleteOldProductAndAddnewProduct((await oldCategoryName).toString(),productname,updateProductDto.id);
                console.error(result);
                }
                catch(Error)
                {
                    throw(Error);
                }
            }
        }
        if(brand != null)
        {}
        if(image != null)
        {}
        if(Cart != null)
        {}
        

        


        return await oldProduct.save();
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
                  console.error('categoryUpdate',categoriesToUpdate);
                  // Update each category to remove the reference to the deleted product
                  categoriesToUpdate.Products.splice(
                    categoriesToUpdate.Products.indexOf((
                        await this.productModel.findById(id))._id.toHexString()),1);
                        await categoriesToUpdate.save()
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
        const product = await this.productModel.findOne({ categoryname: createProductDto.productname }).exec();
        if (!product) {
            Logger.error('Category not found');
            return false;
        }
        return true;
    }

    async create(createProductDto: ProductDto): Promise<Product> {
        const {productname,length, weight, width, height ,size, color, numberstock,price,description,viewcount,image,categoryName, brand,Cart} = createProductDto ;
        const exists = await this.findNameAndCode(createProductDto);
        if (exists) {
            Logger.error('Category already exists');
            return null;
        }


        const category = await this.categoryService.findByName(createProductDto.categoryName);
        console.error('New Product',createProductDto);
        console.error('Category ..',category);
        
        const createdProduct = new Product();
        createdProduct.productname = productname;
        createdProduct.size = size;
        createdProduct.color = color;
        createdProduct.price = price;
        createdProduct.numberstock = numberstock;
        createdProduct.description = description;
        createdProduct.viewcount = viewcount;
        createdProduct.image = image;
        createdProduct.length = length;

        createdProduct.width = width;

        createdProduct.height = height;
        createdProduct.weight = weight;

        var id = await this.categoryService.findByNameReturnId(createProductDto.categoryName);
        console.error('categoryName',createProductDto.categoryName);
        console.log('id type',typeof(id));
        createdProduct.Category = id;
        //createdProduct.Brand = brand;
        //createdProduct.Cart = Cart;


        const createdProducts = new this.productModel(createdProduct);
       
        const saveProduct = await createdProducts.save();
        console.error('Product error',saveProduct);
        category.Products.push(saveProduct._id.toHexString());
        const savedCategory =new this.categoryModel(category);
        savedCategory.save();
        console.log('Category after push',savedCategory);
        return saveProduct;
    }

    async findAll(): Promise<Product[]> {

        return this.productModel.find().exec();
    }

}