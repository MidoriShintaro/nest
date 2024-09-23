import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Orderdetail } from 'src/orderdetail/entity/Orderdetail.entity';

export type ProductDocument = HydratedDocument<Product>;

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
export class Product {
  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: String, required: true })
  size: string;

  @Prop({ type: String, required: true })
  color: string;

  @Prop({ type: Number })
  numberStock: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: Number })
  width: number;

  @Prop({ type: Number })
  length: number;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  viewCount: number;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  brand: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  cart: string;

  @Prop({ type: String })
  guarantee: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Voucher' }] })
  vouchers: string[];

  @Prop({ type: [{ type: String, ref: 'Review' }] })
  reviews: string[];

  @Prop({ type: Types.ObjectId, ref: 'Orderdetail' })
  orderDetail: Orderdetail;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
