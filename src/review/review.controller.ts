import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/role.guard";
import { User, UserRole } from "src/user/entity/user.entity";
import { Roles } from "src/auth/roles.decorator";
import { ReviewDTO } from "./dto/review.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { Review } from "./entity/Review.entity";


@Controller('api/review')
@UseGuards(JwtAuthGuard)
export class ReviewController
{
    constructor (private readonly reviewService: ReviewService){}

    @Post()
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles([UserRole.USER])
    async create(@Body() reiewDto:ReviewDTO, @GetUser() user:User):Promise<Review>
    {
        return this.reviewService.create(reiewDto, user);
    }
    //@Get()
    //@HttpCode(200)
    //@UseGuards(RolesGuard)
    //@Roles([UserRole.USER])
    //async findOne(@GetUser() user: User )
    //{
    //    console.log('user is',user); // In ra thông tin người dùng
        
    //    // Thực hiện các thao tác khác với thông tin người dùng...
    //    return 'This action returns all users';
    //}
    @Get()
    async getAll(@GetUser() user:User):Promise<Review[]>
    {
        console.error('user is',user);
        return this.reviewService.findAll(user);
    }
    @Put(':id')
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles([UserRole.USER])
    async update(@Param('id') id:string,@Body() reviewDto:ReviewDTO, @GetUser() user:User):Promise<Review>
    {
        return this.reviewService.update(reviewDto, id, user);
    }

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles([UserRole.USER])
    async delete(@Param('id') id:string, @GetUser() user:User)
    {
   
        await this.reviewService.delete(id, user);
    }
    
}