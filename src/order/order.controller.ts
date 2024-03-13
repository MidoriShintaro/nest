import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dto/order.dto";
import { Order } from "./entity/Order.entity";


@Controller('/order')
export class OrderController
{
    constructor (private readonly orderService: OrderService){}

    //@Post()
    //async create(@Body() orderDto:OrderDto):Promise<Order>
    //{
    //    return this.orderService.create(orderDto);
    //}
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