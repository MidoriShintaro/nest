import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orderdetail } from './entity/Orderdetail.entity';
import { ClientSession, Model, Types } from 'mongoose';
import { OrderdetailDto } from './dto/orderdetail.dto';
import { Product } from 'src/product/entity/Product.entity';
import { Order } from 'src/order/entity/Order.entity';

import { User } from 'src/user/entity/user.entity';
// import { session } from 'passport';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(Orderdetail.name) private orderDetailModel: Model<Orderdetail>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private ordertModel: Model<Order>,
    @InjectModel(User.name) private usertModel: Model<User>,
  ) {}

  async updateQuantity(
    updatedOrderDetail: OrderdetailDto,
    id: string,
  ): Promise<Orderdetail> {
    const objectId = new Types.ObjectId(id);
    const oldOrderDetail = await this.orderDetailModel
      .findById(objectId)
      .exec();
    if (!oldOrderDetail) {
      throw new Error('old OrderDetail not found!!!');
    }
    if (oldOrderDetail.quantity != updatedOrderDetail.quantity) {
      oldOrderDetail.quantity = updatedOrderDetail.quantity;
    }

    return oldOrderDetail.save();
  }

  async delete(ids: string[]) {
    for (const id of ids) {
      try {
        const objectId = new Types.ObjectId(id);
        const oldOrderDetail = await this.orderDetailModel
          .findById(objectId)
          .exec();
        if (!oldOrderDetail) {
          throw new Error('Product not found!!!');
        }
        const userId = new Types.ObjectId(oldOrderDetail.UserId);
        const userUpdate = await this.usertModel.findById(userId);
        console.error('userUpdate', userUpdate);
        // Update each category to remove the reference to the deleted product
        userUpdate.OrderdetailIds.splice(
          userUpdate.OrderdetailIds.indexOf(
            (await this.orderDetailModel.findById(id))._id.toHexString(),
          ),
          1,
        );
        await userUpdate.save();

        if (oldOrderDetail.OrderId != undefined) {
          const orderId = new Types.ObjectId(oldOrderDetail.OrderId);
          const orderUpdate = await this.ordertModel.findById(orderId);
          orderUpdate.OrderdetailIds.splice(
            orderUpdate.OrderdetailIds.indexOf(
              (await this.orderDetailModel.findById(id))._id.toHexString(),
            ),
            1,
          );
          await orderUpdate.save();
        }
        const productId = new Types.ObjectId(oldOrderDetail.ProductId);
        const productDelete = await this.ordertModel.findById(productId);
        if (productDelete.OrderdetailIds != undefined) {
          productDelete.OrderdetailIds.splice(
            productDelete.OrderdetailIds.indexOf(
              (await this.orderDetailModel.findById(id))._id.toHexString(),
            ),
            1,
          );
          await productDelete.save();
        }
        const result = await oldOrderDetail.deleteOne();
        if (result.deletedCount === 0) {
          throw new Error('No product is deleted');
        }
      } catch (error) {
        console.log(error);
        // Handle error or rethrow it
      }
    }
  }

  async create(createOrderDetail: OrderdetailDto): Promise<Orderdetail> {
    const session: ClientSession = await this.orderDetailModel.startSession();
    try {
      session.startTransaction();

      const { quantity, ProductId, OrderId, userId } = createOrderDetail;
      const OrderDetail = new Orderdetail();
      console.error('createDetail is', createOrderDetail);
      const productObjectId = new Types.ObjectId(ProductId);
      const productFind = await this.productModel
        .findById(productObjectId)
        .exec();
      console.error('ProductFind is', productFind);

      if (!productFind) {
        throw new Error('Product not found!!!');
      }
      const userobjectid = new Types.ObjectId(userId);
      const userFind = await this.usertModel.findById(userobjectid).exec();
      console.error('user find is', userFind);
      if (!userFind) {
        throw new Error('User not found!!!');
      }
      OrderDetail.UserId = userId;

      OrderDetail.ProductId = ProductId;
      OrderDetail.quantity = quantity;

      console.error('product Find is', productFind);
      const priceProduct = productFind.price;
      const orderObjectId = new Types.ObjectId(OrderId);
      console.error('Order is ', OrderId);
      if (OrderId != undefined) {
        const orderFind = await this.productModel
          .findById(orderObjectId)
          .exec();
        if (!orderFind) {
          throw new Error('Order not found!!!');
        }
        OrderDetail.OrderId = OrderId;
      }

      OrderDetail.UnitPrice = quantity * priceProduct;

      OrderDetail.active = false;
      const orderdetail = new this.orderDetailModel(OrderDetail);
      const orderDetailsaved = orderdetail.save();
      const orderDetails = userFind.OrderdetailIds;
      orderDetails.push((await orderDetailsaved)._id.toHexString());
      userFind.OrderdetailIds = orderDetails;

      await userFind.save();
      console.error('Order detail is', orderDetailsaved);
      console.error('user after saved is', userFind);

      return orderDetailsaved;
      session.commitTransaction();
      session.endSession();
    } catch (Error) {
      session.abortTransaction();
      session.endSession();
    }
  }

  async findAllInOrder(): Promise<Orderdetail[]> {
    return this.orderDetailModel.find().exec();
  }

  async findAll(): Promise<Orderdetail[]> {
    return this.orderDetailModel.find().exec();
  }
}
