import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { Payment } from './entity/Payment.entity';

@Controller('/api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getPayments(): Promise<Payment[]> {
    return await this.paymentService.getPayments();
  }

  @Post()
  async create(@Body() paymentDto: PaymentDto): Promise<Payment> {
    return this.paymentService.create(paymentDto);
  }
  //    @Put(':id')
  //    async update(@Param('id') id:string, @Body() categoryDto:CategoriesDTO ): Promise<Category>{
  //       return this.categoryService.update(categoryDto,id);
  //    }
  //    @Delete()
  //    async delete(@Body() body:any){
  //        const ids:string[] = body.ids;
  //        console.error('id from rest',ids)

  //       this.categoryService.delete(ids);
  //    }

  //    @Get()
  //    async getAll():Promise<Category[]>{
  //        return this.categoryService.findAll();
  //    }
}
