import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './utils/email/email.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoriesModule } from './categories/categories.module';
import { Product } from './product/entity/Product.entity';
import { ProductModule } from './product/product.module';
import { VoucherModule } from './voucher/voucher.module';
import { OrderdetailModule } from './orderdetail/orderdetail.module';

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
    OrderdetailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
