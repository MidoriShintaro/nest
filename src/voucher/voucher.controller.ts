import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherDto } from './dto/Voucher.dto';
import { Voucher } from './entity/Voucher.entity';


@Controller('/vouchers')
export class VoucherController {

    constructor (private readonly voucherService: VoucherService){}


    @Post()
    async create(@Body() voucherDto:VoucherDto): Promise<Voucher>{
        
        return this.voucherService.create(voucherDto);
        
    }
    @Put(':id')
    async update(@Param('id') id:string, @Body() voucherDto:VoucherDto ): Promise<Voucher>{
        console.error("id is:",id);
       return this.voucherService.update(voucherDto,id);
    }
    @Delete()
    async delete(@Body() body:any){
        const ids:string[] = body.ids;
        console.error('id from rest',ids)
        
       this.voucherService.delete(ids);
    }

    @Get()
    async getAll():Promise<Voucher[]>{
        return this.voucherService.findAll();
    }

}
