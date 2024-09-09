import { Controller, Get, Query } from '@nestjs/common';
import { ZalopayService } from './zalopay.service'; 

@Controller('zalopay')
export class ZalopayController {
    constructor(private readonly zalopayService: ZalopayService) {}

    @Get('create')
    async createPayment(@Query('amount') amount:number, @Query('username')username:string,@Query('app_trans_id')app_trans_id:string) {
        return this.zalopayService.createPayment(amount, username,app_trans_id);
    }
    
    @Get('result')
    async getResult(@Query('app_trans_id') app_trans_id:number) {
        return this.zalopayService.getResult(app_trans_id);
    }
}