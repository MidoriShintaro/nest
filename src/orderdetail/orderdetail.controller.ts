import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrderdetailDto } from './dto/OrderDetail.dto';
import { Orderdetail } from './entity/OrderDetail.entity';
import { OrderDetailService } from './orderdetail.service';

@Controller('/api/orderDetail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  async create(@Body() orderDetailDto: OrderdetailDto): Promise<Orderdetail> {
    return this.orderDetailService.create(orderDetailDto);
  }
  //@Get(':id')
  //async getAllInOder(@Param()id:string):Promise<Orderdetail[]>
  //{
  //    return this.OrderDetailService.findAllInOrder(id);
  //}
  @Get()
  async getAllInOder(): Promise<Orderdetail[]> {
    return this.orderDetailService.findAllInOrder();
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() orderDetailDto: OrderdetailDto,
  ): Promise<Orderdetail> {
    return this.orderDetailService.updateQuantity(orderDetailDto, id);
  }

  @Delete()
  async delete(@Body() body: any) {
    const orderDetailIds: string[] = body.ids;
    console.error('orderDetail', orderDetailIds);
    // await this.orderDetailService.delete(orderDetailIds);
  }
}
