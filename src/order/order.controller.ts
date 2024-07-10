import {
  Body,
  Controller,
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
  @Get()
  @HttpCode(200)
  async getAllOrder(): Promise<Order[]> {
    // In ra thông tin người dùng
    // Thực hiện các thao tác khác với thông tin người dùng...
    return await this.orderService.getAllOrder();
  }

  @Get('/:user')
  @HttpCode(200)
  async getOrderByUser(@Param('user') user: string): Promise<Order[]> {
    return await this.orderService.getOrdersByUser(user);
  }
  //@Get()
  //async getAll():Promise<Product[]>
  //{
  //    return this.productService.findAll();
  //}
  //@Put(':id')
  //async update(@Param('id') id:string,@Body() productDto:ProductDto):Promise<Product>
  //{
  //    return this.productService.update(productDto, id);
  //}

  //@Delete()
  //async delete(@Body() body:any)
  //{
  //    const productIds: string[] = body.ids;
  //    console.error('products', productIds);
  //    await this.productService.delete(productIds);
  //}
}
