import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderdetailDocument = HydratedDocument<Orderdetail>;

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
export class Orderdetail {
  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: string;

  @Prop({ type: Boolean })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId: string;

  @Prop({ type: Number })
  unitPrice: number;
}

export const OrderdetailSchema = SchemaFactory.createForClass(Orderdetail);
