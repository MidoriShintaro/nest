import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher, VoucherSchema } from './entity/Voucher.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:Voucher.name, schema: VoucherSchema}])],
  controllers: [VoucherController], 
  providers:[VoucherService],

  exports: [VoucherService]
})
export class VoucherModule {}
