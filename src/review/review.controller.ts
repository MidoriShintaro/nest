import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/entity/user.entity';
import { ReviewDTO } from './dto/review.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { Review } from './entity/Review.entity';

@Controller('api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() reviewDto: ReviewDTO,
    @GetUser() user: User,
  ): Promise<Review> {
    return await this.reviewService.create(reviewDto, user);
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
  @Get('/:userId')
  async getAll(@Param('userId') user: string): Promise<Review[]> {
    return this.reviewService.findAll(user);
  }

  @Post('/:productId')
  @UseGuards(JwtAuthGuard)
  async getReviewByProductId(
    @Param('productId') id: string,
  ): Promise<Review[]> {
    return await this.reviewService.getReviewByProductId(id);
  }

  @Get()
  async getAllReviews(): Promise<Review[]> {
    return await this.reviewService.getAllReviews();
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() reviewDto: ReviewDTO,
    @GetUser() user: User,
  ): Promise<string> {
    return this.reviewService.update(reviewDto, id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async delete(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return await this.reviewService.delete(id, user);
  }
}
