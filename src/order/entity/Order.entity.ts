import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Orderdetail } from 'src/orderdetail/entity/Orderdetail.entity';
import { Payment } from 'src/payment/entity/Payment.entity';
import { Shipping } from 'src/shipping/entity/shipping.entity';

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
  

  @Prop({ type: String, required: true })
  status: string;

  @Prop({type:[{type:Types.ObjectId, ref:'Orderdetail'}]})
  Orderdetails: string[];

  @Prop({type:Types.ObjectId, ref:'Payment'})
  Payment: string;

  @Prop({type:[{type:Types.ObjectId, ref:'Shipping'}]})
  Shippings:string[];
 
}

export const OrderSchema = SchemaFactory.createForClass(Order);
