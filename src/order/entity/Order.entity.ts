import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Orderdetail } from 'src/orderdetail/entity/Orderdetail.entity';
import { Payment } from 'src/payment/entity/Payment.entity';

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
  

  @Prop({ type:String ,enum:{
    values:['NOTPAY','PAID']
  }, required: true })
  status: string;

  @Prop({type:[{type:Types.ObjectId, ref:'Orderdetail'}]})
  orderdetailIds: string[];

  @Prop({type:Types.ObjectId, ref:'Payment'})
  paymentId: string;

  @Prop({type:Types.ObjectId, ref:'User'})
  userId: string;

  @Prop({ type: Number})
  totalAmount: number;

  @Prop({ type: String})
  address: string;

  @Prop({ type: String})
  zipcode: string;

  @Prop({ type: Number})
  totalDue: number;
  
  @Prop({ type:Boolean , required: true })
  active: boolean;
  
}

export const OrderSchema = SchemaFactory.createForClass(Order);