import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entity/Order.entity';
import { ClientSession, Model, Types } from 'mongoose';
import { OrderDto } from './dto/order.dto';
import { Orderdetail } from 'src/orderdetail/entity/Orderdetail.entity';
import { Product } from 'src/product/entity/Product.entity';
import { Payment } from 'src/payment/entity/Payment.entity';

import { User } from 'src/user/entity/user.entity';
import { Cart } from 'src/cart/entity/cart.entity';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
import { OrderdetailDto } from 'src/orderdetail/dto/orderdetail.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Orderdetail.name) private orderdetailModel: Model<Orderdetail>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private orderDetailService:OrderDetailService
  
   

  ) {}

  async create(createProductDto: OrderDto): Promise<Order> {
    console.log('You are doing in this function');


    const session: ClientSession = await this.orderModel.startSession();
    session.startTransaction();
    try {
      
      const { cartIds } = createProductDto;
    
      const orderModel = new Order();
        const usesrId = new Types.ObjectId(createProductDto.user);
      const userObject = await this.userModel.findById(usesrId);
        console.log('userObject', userObject);
        const userObjectId = userObject._id.toHexString();
        orderModel.userId = userObjectId;
        orderModel.status = 'NOTPAY';
        orderModel.active = true;
        orderModel.address = createProductDto.address;
        orderModel.zipcode = createProductDto.zipcode;
       


        const orderSaved = new this.orderModel(orderModel);

        const orderCreated = await orderSaved.save();
        console.log('orderCreated',orderCreated);


      let totalPrice = 0;
      for (const cartId of cartIds) {
        const cartObject = new Types.ObjectId(cartId);
        const cart = await this.cartModel
          .findById(cartObject)
          .exec();
          const orderDetailModel = new Orderdetail();
      
          orderDetailModel.productId = cart.product;
          orderDetailModel.quantity = cart.quantity;
          const productObject = await this.productModel.findById(new Types.ObjectId(cart.product));
          const price = productObject.price;
          totalPrice = price * cart.quantity;
          orderDetailModel.unitPrice = price * cart.quantity;
          orderDetailModel.orderId = orderCreated.id;
          orderDetailModel.active = true;
         const orderdetailt = new this.orderdetailModel(orderDetailModel);
        const test = await orderdetailt.save();
         console.log('orderdetailt', test);
       }

      console.error('total Price ', totalPrice);
      orderCreated.totalAmount = totalPrice;
      
       const result =await orderCreated.save();
       console.error('result', result)

     
      await userObject.OrderIds.push(result.id);
      return result;
      session.commitTransaction();
     
    } catch (error) {
      console.log(error);
      session.abortTransaction();
      
    }finally{
      session.endSession();
    }
  }
  async cancelOrder(orderId: string): Promise<Boolean> {
    


    const session: ClientSession = await this.orderModel.startSession();
    session.startTransaction();
    try {
      const orderObject = new Types.ObjectId(orderId);
      const orderObjectModel = await this.orderModel.findById(orderObject).exec();
      orderObjectModel.active = false;
      await orderObjectModel.save();
      return true;
      session.commitTransaction();
     
    } catch (error) {
      console.log(error);
      session.abortTransaction();
      return false;
    }finally{
      session.endSession();
    }
  }
  async getAllOrder(id: string): Promise<Order[]> {


    const session: ClientSession = await this.orderModel.startSession();
    session.startTransaction();
    try {
      
      const userModel = this.userModel.findById(id).exec();

      if(userModel === undefined)
        {
            throw new NotFoundException('Not found user');
        }
     
       return this.orderModel.find({userId:id, active:true});


    } catch (error) {
     
      session.abortTransaction();
      
    }finally{
      session.endSession();
    }
  }


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