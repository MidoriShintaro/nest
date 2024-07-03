import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrderdetailDto } from './dto/orderdetail.dto';
import { Orderdetail } from './entity/Orderdetail.entity';
import { OrderDetailService } from './orderdetail.service';

@Controller('/api/orderdetail')
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
    return this.orderDetailService.findAll();
  }
  @Get('/get/order/:id')
  async getAllOfOrder(@Param('id')orderID: string): Promise<OrderdetailDto[]> {
    return this.orderDetailService.findAllInOrder(orderID);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() orderDetailDto: OrderdetailDto,
  ): Promise<Orderdetail> {
    return this.orderDetailService.updateQuantity(orderDetailDto, id);
  }

  
}
