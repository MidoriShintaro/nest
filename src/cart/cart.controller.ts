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

  @Get()
  async getAllCartAllProducts(): Promise<Cart[]> {
    return await this.cartService.getAllCartAllProduct();
  }

  @Get('/:userId')
  async getAllCartProducts(@Param('userId') user: string): Promise<Cart[]> {
    return this.cartService.getAllCartProduct(user);
  }

  @Post()
  async addToCart(@Body() cart: CartDto): Promise<string> {
    return await this.cartService.addToCart(cart);
  }

  @Patch('/:id')
  async updateCart(
    @Param('id') id: string,
    @Body() cart: CartDto,
  ): Promise<string> {
    return await this.cartService.updateCart(id, cart);
  }

  @Delete('/:id')
  async removeFromCart(@Param('id') id: string): Promise<string> {
    return await this.cartService.removeFromCart(id);
  }
}
