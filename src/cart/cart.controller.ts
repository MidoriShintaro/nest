import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';
import { CartDto } from './dto/cart.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('/api/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('/:userId')
  async getAllCartProducts(@Param('userId') user: string): Promise<Cart[]> {
    return this.cartService.getAllCartProduct(user);
  }

  @Post()
  async addToCart(@Body() cart: CartDto): Promise<string> {
    return await this.cartService.addToCart(cart);
  }

  @Patch('/:userId/:productId')
  async updateCart(
    @Param('userId') user: string,
    @Param('productId') product: string,
    @Body() cart: CartDto,
  ): Promise<string> {
    return await this.cartService.updateCart(user, product, cart);
  }

  @Delete('/:userId/:productId')
  async removeFromCart(
    @Param('userId') user: string,
    @Param('productId') product: string,
  ): Promise<string> {
    return await this.cartService.removeFromCart(user, product);
  }
}
