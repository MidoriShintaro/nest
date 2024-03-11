//import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';


//@Controller('/categories')
//export class PaymentController {

//    constructor (private readonly paymentService: PaymentService){}


//    @Post()
//    async create(@Body() categoryDto:CategoriesDTO ): Promise<Category>{
        
//        return this.categoryService.create(categoryDto);
        
//    }
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

//}
