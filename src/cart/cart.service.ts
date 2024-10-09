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

  async getAllCartAllProduct(): Promise<Cart[]> {
    return await this.cartModel.find().populate({
      path: 'product',
      select: 'productName price category',
      populate: { path: 'category', select: 'categoryName' },
    });
  }

  async getAllCartProduct(user: string): Promise<Cart[]> {
    return await this.cartModel.find({ user }).populate({
      path: 'product',
      select: 'productName price category image',
      populate: { path: 'category reviews', select: 'categoryName rate' },
    });
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
    cartId: string,
    { quantity, user, product }: CartDto,
  ): Promise<string> {
    const item = await this.cartModel.findById(cartId);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await item.updateOne({ quantity, user, product }, { new: true });
    return 'Item updated successfully';
  }

  async removeFromCart(cartId: string): Promise<string> {
    const item = await this.cartModel.findById(cartId);

    if (!item) throw new NotFoundException('Item not found');

    await item.deleteOne();

    return 'Remove item from cart';
  }

  async removeAllFromCartByUser(userId: string): Promise<string> {
    const items = await this.cartModel.find({ user: userId });
    if (items.length < 0) throw new NotFoundException('Item not found');
    for (const item of items) {
      await item.deleteOne();
    }
    return 'Remove all items from cart';
  }
}
