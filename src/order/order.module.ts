import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entity/Order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  Orderdetail,
  OrderdetailSchema,
} from 'src/orderdetail/entity/Orderdetail.entity';
import { Payment, PaymentSchema } from 'src/payment/entity/Payment.entity';
import { Product, ProductSchema } from 'src/product/entity/Product.entity';
import { User, UserSchema } from 'src/user/entity/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Orderdetail.name, schema: OrderdetailSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
