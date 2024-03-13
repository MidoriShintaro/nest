import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Orderdetail } from 'src/orderdetail/entity/Orderdetail.entity';
import { Payment } from 'src/payment/entity/Payment.entity';
import { Shipping } from 'src/shipping/entity/shipping.entity';
import { Column } from 'typeorm';

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
  

  @Prop({ type: Boolean, required: true })
  status: boolean;

  @Prop({type:[{type:Types.ObjectId, ref:'Orderdetail'}]})
  OrderdetailIds: string[];

  @Prop({type:Types.ObjectId, ref:'Payment'})
  PaymentId: string;

  @Prop({type:[{type:Types.ObjectId, ref:'Shipping'}]})
  ShippingIds:string[];

  @Prop({ type: Number})
  totalAmount: number;
 
}

export const OrderSchema = SchemaFactory.createForClass(Order);
