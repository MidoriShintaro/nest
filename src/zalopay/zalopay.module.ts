import { Module } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';
import { ZalopayController } from './zalopay.controller';

@Module({
    imports: [],
    controllers: [ZalopayController],
    providers: [ZalopayService],
})
export class ZaloPayModule {}