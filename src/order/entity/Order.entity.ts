import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

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
export class Order {
  @Prop({
    type: String,
    enum: {
      values: ['NOTPAY', 'PAID', 'EXPIRES', 'CANCEL'],
    },
    required: true,
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  paymentId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: Number })
  totalAmount: number;

  @Prop({ type: Number })
  totalDue: number;
  @Prop({ type: String })
  orderCode: string;

  @Prop({ type: String })
  address: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
