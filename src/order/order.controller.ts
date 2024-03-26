import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dto/order.dto";
import { Order } from "./entity/Order.entity";
import { GetUser } from "src/auth/get-user.decorator";
import { User, UserRole } from "src/user/entity/user.entity";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/role.guard";
import { JwtAuthGuard } from "src/auth/auth.guard";

@Controller('api/order')
@UseGuards(JwtAuthGuard)
export class OrderController
{
    constructor (private readonly orderService: OrderService){}

    @Post()
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles([UserRole.USER])
    async create(@Body() orderDto:OrderDto, @GetUser() user:User):Promise<Order>
    {
        return this.orderService.create(orderDto, user);
    }
    @Get()
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles([UserRole.USER])
    async findOne(@GetUser() user: User )
    {
        console.log('user is',user); // In ra thông tin người dùng
        
        // Thực hiện các thao tác khác với thông tin người dùng...
        return 'This action returns all users';
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