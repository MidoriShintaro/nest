import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order } from "./entity/Order.entity";
import { Model } from "mongoose";
import { OrderDto } from "./dto/order.dto";
import { In } from "typeorm";
import { Orderdetail } from "src/orderdetail/entity/Orderdetail.entity";
import { Mode } from "fs";


@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

    // async create(createProductDto: OrderDto): Promise<Order> {
    //    const {orderdetailIds,paymentId,shippingIds} = createProductDto;
    //    const orderModel = new Order();
    //    orderModel.status = true;
    //    orderdetailIds.forEach(orderDetailId => {
         
    //    });
    //    orderModel.OrderdetailIds = orderdetailIds;
    //    orderModel.PaymentId = paymentId;
    //    orderModel.ShippingIds = shippingIds;

    //    const orderSaved = new this.orderModel(orderModel);
    //    const orderCreated = await orderSaved.save();

    //    return orderCreated;

    //}

    //async update(updateProductDto: ProductDto, id:string): Promise<Product> {
    //    const objectId = new Types.ObjectId(id);
    //    const oldProduct = await this.productModel.findById(objectId).exec();
    //    if (!oldProduct) {
    //        throw new Error('old Prodcut not found!!!');
    //    }
    //    const {productname, size, color, numberstock,price,description,viewcount,image,categoryName, brand,Cart} = updateProductDto ;
    //    if(productname!=null)
    //    {
    //        oldProduct.productname = productname;
    //    }
    //    if(size != null)
    //    {
    //        oldProduct.size = size;
    //    }
    //    if(color != null)
    //    {
    //        oldProduct.color = color;
    //    }
    //    if(numberstock != null)
    //    {
    //        oldProduct.numberstock = numberstock;
    //    }
    //    if(price != null)
    //    {
    //        oldProduct.price = price;
    //    }
    //    if(description != null)
    //    {
    //        oldProduct.description = description;
    //    }
    //    if(viewcount != null)
    //    {
    //        oldProduct.viewcount = viewcount;
    //    }
    //    if(categoryName != null)
    //    {
    //        const oldCategoryName = this.categoryService.findByIdReturnName(oldProduct.Category);
    //        if(categoryName != (await oldCategoryName).toString())
    //        {   
    //            try{
    //            const result = this.categoryService.deleteOldProductAndAddnewProduct((await oldCategoryName).toString(),productname,updateProductDto.id);
    //            console.error(result);
    //            }
    //            catch(Error)
    //            {
    //                throw(Error);
    //            }
    //        }
    //    }
    //    if(brand != null)
    //    {}
    //    if(image != null)
    //    {}
    //    if(Cart != null)
    //    {}
        

        


    //    return await oldProduct.save();
    //}

    //async delete(ids: string[]) {
    //    for (const id of ids) {
    //        try {
    //            const objectId = new Types.ObjectId(id);
    //            const oldProduct = await this.productModel.findById(objectId).exec();
    //            if (!oldProduct) {
    //                throw new Error('Product not found!!!');
    //            }
    //            const categoriesToUpdate = await this.categoryModel.findOne({
    //                Products: id,
    //              });
    //              console.error('categoryUpdate',categoriesToUpdate);
    //              // Update each category to remove the reference to the deleted product
    //              categoriesToUpdate.Products.splice(
    //                categoriesToUpdate.Products.indexOf((
    //                    await this.productModel.findById(id))._id.toHexString()),1);
    //                    await categoriesToUpdate.save()
    //            const result = await oldProduct.deleteOne();
    //            if (result.deletedCount === 0) {
    //                throw new Error('No product is deleted');
    //            }
    //        } catch (error) {
    //            console.log(error);
    //            // Handle error or rethrow it
    //        }
    //    }
    //}

    //async findNameAndCode(createProductDto: ProductDto): Promise<boolean> {
    //    const product = await this.productModel.findOne({ categoryname: createProductDto.productname }).exec();
    //    if (!product) {
    //        Logger.error('Category not found');
    //        return false;
    //    }
    //    return true;
    //}

   

    //async findAll(): Promise<Product[]> {

    //    return this.productModel.find().exec();
    //}

}