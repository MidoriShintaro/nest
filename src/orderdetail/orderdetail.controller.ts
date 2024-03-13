import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderDetailService } from "./orderdetail.service";
import { OrderdetailDto } from "./dto/orderdetail.dto";
import { Orderdetail } from "./entity/Orderdetail.entity";

@Controller('/orderdetail')
export class OrderDetailController
{
    constructor (private readonly OrderDetailService: OrderDetailService){}

    @Post()
    async create(@Body() orderDetailDto:OrderdetailDto):Promise<Orderdetail>
    {
        return this.OrderDetailService.create(orderDetailDto);
    }
    //@Get(':id')
    //async getAllInOder(@Param()id:string):Promise<Orderdetail[]>
    //{
    //    return this.OrderDetailService.findAllInOrder(id);
    //}
    @Get()
    async getAllInOder():Promise<Orderdetail[]>
    {
        return this.OrderDetailService.findAll();
    }
    @Put(':id')
    async update(@Param('id') id:string,@Body() orderDetailDto:OrderdetailDto):Promise<Orderdetail>
    {
        return this.OrderDetailService.updateQuantity(orderDetailDto, id);
    }

    @Delete()
    async delete(@Body() body:any)
    {
        const orderDetailIds: string[] = body.ids;
        console.error('orderDetail', orderDetailIds);
        await this.OrderDetailService.delete(orderDetailIds);
    }
    
}