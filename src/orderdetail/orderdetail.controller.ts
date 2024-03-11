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
    @Get(':id')
    async getAllInOder(@Param()id:string):Promise<Orderdetail[]>
    {
        return this.OrderDetailService.findAllInOrder(id);
    }
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