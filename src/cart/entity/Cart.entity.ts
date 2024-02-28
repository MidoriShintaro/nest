import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
import { Product } from 'src/product/entity/Product.entity';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Cart {

  @Prop({ type: Number })
  quantity: number;

  @Prop({})
  price_per_unit: number;

  @Prop({})
  total_price: number;

  @Prop({})
  created_at: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  User: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product', require: true }] })
  Products: String[];


}

export const CartSchema = SchemaFactory.createForClass(Cart);
