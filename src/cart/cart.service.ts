import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './entity/cart.entity';
import { Model } from 'mongoose';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<Cart>,
  ) {}

  async getAllCartProduct(user: string): Promise<Cart[]> {
    return await this.cartModel
      .find({ user })
      .populate({ path: 'product', select: 'productname price' });
  }

  async addToCart(cart: CartDto): Promise<string> {
    const checkExists = await this.cartModel.findOne({
      $and: [{ user: cart.user }, { product: cart.product }],
    });

    if (checkExists) {
      await checkExists.updateOne(
        {
          quantity: checkExists.quantity + cart.quantity,
        },
        { new: true },
      );
      return 'Add to cart';
    }

    const newCart = new this.cartModel({
      user: cart.user,
      product: cart.product,
      quantity: cart.quantity,
    });
    await newCart.save();
    return 'Add new product to cart';
  }

  async updateCart(
    userId: string,
    productId: string,
    cart: CartDto,
  ): Promise<string> {
    const item = await this.cartModel.findOne({
      $and: [{ user: userId }, { product: productId }],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await item.updateOne({ quantity: cart.quantity }, { new: true });
    return 'Item updated successfully';
  }

  async removeFromCart(userId: string, productId: string): Promise<string> {
    const item = await this.cartModel.findOne({
      $and: [{ user: userId }, { product: productId }],
    });

    await item.deleteOne();

    return 'Remove item from cart';
  }
}
