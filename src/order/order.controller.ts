import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Order } from './entity/Order.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('api/order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() orderDto: OrderDto): Promise<Order> {
    console.log('do this function');
    return this.orderService.create(orderDto);
  }
  @Get('/orderpaid')
  @HttpCode(200)
  async getAllOrderPaid(): Promise<Order[]> {
    // In ra thông tin người dùng
    // Thực hiện các thao tác khác với thông tin người dùng...
    return await this.orderService.getAllOrderPaid();
  }

  @Get()
  @HttpCode(200)
  async getAllOrder(): Promise<Order[]> {
    return await this.orderService.getAllOrder();
  }


  @Get('/user/:user')
  @HttpCode(200)
  async getOrderByUser(@Param('user') user: string): Promise<Order[]> {
    return await this.orderService.getOrdersByUser(user);
  }
  @Get('/ordernotpaid')
  async getAllOrderNotPaid(): Promise<Order[]> {
    return this.orderService.getAllOrderNotPaid();
  }
  @Get('/getorderpaidbyuser/:id')
  async getAllByUserId(@Param('id') id: string): Promise<Order[]> {
    return this.orderService.getAllOrderByUserId(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.orderService.delete(id);
  }
}
