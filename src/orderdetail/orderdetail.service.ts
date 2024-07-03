import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orderdetail } from './entity/Orderdetail.entity';
import { ClientSession, Model, Types } from 'mongoose';
import { OrderdetailDto } from './dto/orderdetail.dto';
import { Product } from 'src/product/entity/Product.entity';
import { Order } from 'src/order/entity/Order.entity';

import { User } from 'src/user/entity/user.entity';
import { ProductDto } from 'src/product/dto/product.dto';
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


  async create(createOrderDetail: OrderdetailDto): Promise<Orderdetail> {
    const session: ClientSession = await this.orderDetailModel.startSession();
    try {
      session.startTransaction();

      const { quantity, productId, orderId, userId } = createOrderDetail;
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
      const orderdetail = new this.orderDetailModel(OrderDetail);
      const orderDetailsaved = orderdetail.save();
      return orderDetailsaved;
      session.commitTransaction();
      session.endSession();
    } catch (Error) {
      session.abortTransaction();
      session.endSession();
    }
  }

  async findAllInOrder(orderId:String): Promise<OrderdetailDto[]> {
    const orderDetailList = await this.orderDetailModel.find({orderId:orderId}).exec();
    console.log("orderDetailList", orderDetailList);
    const result = [];
    for(const orderDetailModel of orderDetailList)
      {
        const product = await this.productModel.findById(new Types.ObjectId(orderDetailModel.productId)).exec();
        const productDto:ProductDto = {
          productName: product.productName,
          price: product.price,
          id: '',
          size: '',
          color: '',
          numberStock: 0,
          description: '',
          viewCount: 0,
          height: 0,
          width: 0,
          length: 0,
          weight: 0,
          image: '',
          categoryName: '',
          brand: '',
          cartId: '',
          ids: []
        }
          const orderDetailDTO:OrderdetailDto = {
            product:productDto,
            quantity:orderDetailModel.quantity,
            unitPrice:orderDetailModel.unitPrice,
            userId:'',
             productId:'',
             orderId:'',

   }
        console.log('orderdetailModel',orderDetailModel);
        result.push(orderDetailDTO);
      }
    return result;
  }

  async findAll(): Promise<Orderdetail[]> {
    return this.orderDetailModel.find().exec();
  }
}
