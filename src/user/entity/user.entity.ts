import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Cart } from 'src/cart/entity/Cart.entity';
import { Review } from 'src/review/entity/Review.entity';
import { Orderdetail } from 'src/orderdetail/entity/Orderdetail.entity';
import { Order } from 'src/order/entity/Order.entity';
import { Voucher } from 'src/voucher/entity/Voucher.entity';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret.password;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class User {
  @Prop({ type: String, unique: true, required: true })
  username: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    min: [8, 'Password must be at least 8 characters'],
  })
  password: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({
    type: String,
    default: UserRole.USER,
    enum: {
      values: ['USER', 'ADMIN', 'MODERATOR'],
      message: 'Roles only have user or admin or moderator',
    },
  })
  role: string;

  @Prop({type: Types.ObjectId, ref : 'Cart'})
  Cart: Cart;

  @Prop({type:[{type:Types.ObjectId, ref: 'Review'}]})
  Reviews: Review[];

  @Prop({type:[{type:Types.ObjectId, ref: 'Voucher'}]})
  Vouchers: Voucher[];
s

}

export const UserSchema = SchemaFactory.createForClass(User);
