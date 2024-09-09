import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './utils/email/email.module';
import { CacheModule } from '@nestjs/cache-manager';
// import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { VoucherModule } from './voucher/voucher.module';
import { OrderdetailModule } from './orderdetail/orderdetail.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { CloudinaryModule } from './utils/cloudinary/cloudinary.module';
import { ZaloPayModule } from './zalopay/zalopay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    AuthModule,
    EmailModule,
    //CategoriesModule,
    ProductModule,
    VoucherModule,
    OrderdetailModule,
    OrderModule,
    PaymentModule,
    ReviewModule,
    CartModule,
    CloudinaryModule,
    ZaloPayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
