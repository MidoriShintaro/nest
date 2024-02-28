import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./entity/Product.entity";
import { ProductDto } from "./dto/product.dto";

@Controller('/product')
export class ProductController
{
    constructor (private readonly productService: ProductService){}

    @Post()
    async create(@Body() productDto:ProductDto):Promise<Product>
    {
        return this.productService.create(productDto);
    }
    @Get()
    async getAll():Promise<Product[]>
    {
        return this.productService.findAll();
    }
    @Put(':id')
    async update(@Param('id') id:string,@Body() productDto:ProductDto):Promise<Product>
    {
        return this.productService.update(productDto, id);
    }

    @Delete()
    async delete(@Body() body:any)
    {
        const productIds: string[] = body.ids;
        console.error('products', productIds);
        await this.productService.delete(productIds);
    }
    
}