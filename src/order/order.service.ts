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
import * as moment from 'moment';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Orderdetail.name) private orderdetailModel: Model<Orderdetail>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private orderDetailService: OrderDetailService,
  ) {}

  async create(createProductDto: OrderDto): Promise<Order> {
    const currentDate = moment();
    console.log('You are doing in this function');
    const transID = Math.floor(Math.random() * 1000000);
    console.log('transID', transID);

    const ordercode = `${currentDate.format('YYMMDD')}_${transID}`;
    console.error('ordercode', moment().format('YYMMDD'));

    console.error('ordercode', ordercode);

    const session: ClientSession = await this.orderModel.startSession();
    session.startTransaction();
    try {
      const { cartIds } = createProductDto;

      const orderModel = new Order();
      const userId = new Types.ObjectId(createProductDto.user);
      console.log('userId', userId);
      const userObject = await this.userModel.findById(userId);
      console.log('userObject', userObject);
      const userObjectId = userObject._id.toHexString();
      orderModel.userId = userObjectId;
      orderModel.status = 'NOTPAY';
      orderModel.address = createProductDto.address;
      const orderSaved = new this.orderModel(orderModel);
      console.log('orderSaved', orderSaved);

      const orderCreated = await orderSaved.save();
      console.log('orderCreated', orderCreated);

      let totalPrice = 0;
      let totalPriceAmount = 0;
      for (const cartId of cartIds) {
        const cartObject = new Types.ObjectId(cartId);
        const cart = await this.cartModel.findById(cartObject).exec();
        const orderDetailModel = new Orderdetail();

        orderDetailModel.productId = cart.product;
        orderDetailModel.quantity = cart.quantity;
        const productObject = await this.productModel.findById(
          new Types.ObjectId(cart.product),
        );
        const price = productObject.price;
        totalPrice = price * cart.quantity;
        orderDetailModel.unitPrice = price * cart.quantity;
        orderDetailModel.orderId = orderCreated.id;
        orderDetailModel.active = true;
        totalPriceAmount = totalPriceAmount + totalPrice;
        const orderdetailt = new this.orderdetailModel(orderDetailModel);
        await orderdetailt.save();
      }

      orderCreated.totalAmount = totalPriceAmount;
      orderCreated.orderCode = ordercode;
      const result = await orderCreated.save();

      await userObject.OrderIds.push(result.id);
      return result;
      session.commitTransaction();
    } catch (error) {
      console.log(error);
      session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const orders = await this.orderModel.find({ userId });
    if (!orders) throw new NotFoundException('Order not found');

    return orders;
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

  async delete(id: string) {
    try {
      console.log('order id', id);
      const objectId = new Types.ObjectId(id);
      console.log('order id', objectId);
      const oldOrder = await this.orderModel.findById(objectId).exec();
      if (!oldOrder) {
        throw new Error('Order not found!!!');
      }

      const result = await oldOrder.deleteOne();
      if (result.deletedCount === 0) {
        throw new Error('No Order is deleted');
      }
      return 'Delete order successfully';
    } catch (error) {
      console.log(error);
      // Handle error or rethrow it
    }
  }

  async getAllOrderByUserId(userId: string): Promise<Order[]> {
    return await this.orderModel.find({ userId, status: 'PAID' }).populate({
      path: 'userId paymentId',
      select: 'username email phoneNumber value',
    });
  }
  async getAllOrderPaid(): Promise<Order[]> {
    return await this.orderModel.find({ status: 'PAID' }).populate({
      path: 'userId paymentId',
      select: 'username email phoneNumber value',
    });
  }
  async getAllOrder(): Promise<Order[]> {
    return await this.orderModel.find().populate({
      path: 'userId paymentId',
      select: 'username email phoneNumber value',
    });
  }
  async getAllOrderNotPaid(): Promise<Order[]> {
    return await this.orderModel.find({ status: 'NOTPAY' }).populate({
      path: 'userId paymentId',
      select: 'username email phoneNumber value',
    });
  }
  async getAllOrder(): Promise<Order[]> {
    return await this.orderModel.find().populate('userId paymentId');
  }
}
