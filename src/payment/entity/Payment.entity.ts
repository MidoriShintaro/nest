import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types  } from 'mongoose';
import { Order } from 'src/order/entity/Order.entity';

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
      values: ['MOMO', 'BANK', 'PAYBACK'],
    },
  })
  method: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Number})
  shipvalue: number;

  

  @Prop({type:Types.ObjectId, ref:'Order'})
  OrderId:string;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
