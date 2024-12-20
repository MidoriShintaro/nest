import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

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
export class Payment {
  @Prop({
    type: String,
    enum: {
      values: ['ZALOPAY','PAYLATER'],
    },
  })
  method: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Number })
  shipValue: number;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
