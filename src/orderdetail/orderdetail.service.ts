import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Orderdetail } from "./entity/Orderdetail.entity";
import { ClientSession, Model, Types } from "mongoose";
import { OrderdetailDto } from "./dto/orderdetail.dto";
import { Product } from "src/product/entity/Product.entity";
import { Order } from "src/order/entity/Order.entity";

import { User } from "src/user/entity/user.entity";
import { session } from "passport";

@Injectable()
export class OrderDetailService {
    constructor(@InjectModel(Orderdetail.name) private orderDetailModel: Model<Orderdetail>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private ordertModel: Model<Order>,
    @InjectModel(User.name) private usertModel: Model<User>) { }



    //async update(updateProductDto: OrderDetail, id:string): Promise<Product> {
    //    const objectId = new Types.ObjectId(id);
    //    const oldProduct = await this.productModel.findById(objectId).exec();
    //    if (!oldProduct) {
    //        throw new Error('old Prodcut not found!!!');
    //    }
    //    const {productname, size, color, numberstock,price,description,viewcount,image,categoryName, brand,Cart} = updateOrderDetail ;
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
    //            const result = this.categoryService.deleteOldProductAndAddnewProduct((await oldCategoryName).toString(),productname,updateOrderDetail.id);
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

    //async findNameAndCode(createOrderDetail: OrderDetail): Promise<boolean> {
    //    const product = await this.productModel.findOne({ categoryname: createOrderDetail.productname }).exec();
    //    if (!product) {
    //        Logger.error('Category not found');
    //        return false;
    //    }
    //    return true;
    //}

    async create(createOrderDetail: OrderdetailDto): Promise<Orderdetail> {
        const session: ClientSession =await this.orderDetailModel.startSession();
        try{
        
        session.startTransaction();

        const {  quantity,ProductId,OrderId, userId} = createOrderDetail;
        var OrderDetail = new Orderdetail();
        console.error('createDetail is',createOrderDetail);
        const productObjectId = new Types.ObjectId(ProductId);
        const productFind = await this.productModel.findById(productObjectId).exec();
        if (!productFind) {
            throw new Error('Product not found!!!');
        }
        const userobjectid = new Types.ObjectId(ProductId);
        const userFind = await this.productModel.findById(userobjectid).exec();
        if (!userFind) {
            throw new Error('User not found!!!');
        }
        OrderDetail.UserId = userId;

        OrderDetail.ProductId = ProductId;
        OrderDetail.quantity = quantity;
        
        console.error('product Find is',productFind);
        const priceProduct = productFind.price;
        const orderObjectId = new Types.ObjectId(OrderId);
        console.error('Order is ',OrderId);
        if(OrderId != undefined)
        {
            const orderFind = await this.productModel.findById(orderObjectId).exec();
            if (!orderFind) {
                throw new Error('Order not found!!!');
                
            }
            OrderDetail.OrderId = OrderId;
        }

        
        OrderDetail.UnitPrice = quantity * priceProduct;
        
       
        const orderdetail =new this.orderDetailModel(OrderDetail);
        const orderDetailsaved = orderdetail.save();
        const orderDetails = userFind.Orderdetail;

        return orderDetailsaved;
        session.commitTransaction();
        session.endSession()
       }
       catch(Error)
       {
        session.abortTransaction();
        session.endSession();
       }
    }

    async findAllInOrder(OrderId: string): Promise<Orderdetail[]> {

        return this.orderDetailModel.find().exec();
    }

}