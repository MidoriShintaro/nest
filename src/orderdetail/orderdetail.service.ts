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
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
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

  async create(createOrderDetail: OrderdetailDto): Promise<Orderdetail> {
    const session: ClientSession = await this.orderDetailModel.startSession();
    try {
      session.startTransaction();

      const { quantity, productId, orderId } = createOrderDetail;
      const OrderDetail = new Orderdetail();
      console.error('createDetail is', createOrderDetail);
      const productObjectId = new Types.ObjectId(productId);
      const productFind = await this.productModel
        .findById(productObjectId)
        .exec();
      console.error('ProductFind is', productFind);

      if (!productFind) {
        throw new Error('Product not found!!!');
      }

      OrderDetail.productId = productId;
      OrderDetail.quantity = quantity;

      console.error('product Find is', productFind);
      const priceProduct = productFind.price;
      const orderObjectId = new Types.ObjectId(orderId);
      console.error('Order is ', orderId);
      if (orderId != undefined) {
        const orderFind = await this.productModel
          .findById(orderObjectId)
          .exec();
        if (!orderFind) {
          throw new Error('Order not found!!!');
        }
        OrderDetail.orderId = orderId;
      }

      OrderDetail.unitPrice = quantity * priceProduct;

      OrderDetail.active = true;
      const orderDetail = new this.orderDetailModel(OrderDetail);
      const orderDetailSaved = orderDetail.save();
      return orderDetailSaved;
      session.commitTransaction();
      session.endSession();
    } catch (Error) {
      session.abortTransaction();
      session.endSession();
    }
  }

  async findAllInOrder(): Promise<Orderdetail[]> {
    return this.orderDetailModel
      .find()
      .populate({
        path: 'productId',
        populate: {
          path: 'category reviews image',
          select: 'categoryName rate',
        },
        select: 'productName price',
      })
      .populate({ path: 'orderId', select: 'totalAmount userId status' })
      .exec();
  }
  async findAllInOrderByOrderId(orderId:string): Promise<Orderdetail[]> {
    console.log('orderid', orderId);
    console.log(this.orderDetailModel
      .find({orderId:orderId}).exec());
    return this.orderDetailModel
      .find({orderId:orderId})
      .populate({
        path: 'productId',
        populate: {
          path: 'category reviews',
          select: 'categoryName rate',
        },
        select: 'productName price',
      })
      .populate({ path: 'orderId', select: 'totalAmount totalDue userId status' })
      .exec();
  }
}
