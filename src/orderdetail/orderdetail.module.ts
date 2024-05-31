import { Module } from '@nestjs/common';
import { Orderdetail, OrderdetailSchema } from './entity/Orderdetail.entity';
import { Order, OrderSchema } from 'src/order/entity/Order.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailController } from './orderdetail.controller';
import { OrderDetailService } from './orderdetail.service';
import { Product, ProductSchema } from 'src/product/entity/Product.entity';
import { User, UserSchema } from 'src/user/entity/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orderdetail.name, schema: OrderdetailSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
})
export class OrderdetailModule {}
