import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/entity/Product.entity';
import { Order } from 'src/order/entity/Order.entity';

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
  quantity:number;

  @Prop({type:Types.ObjectId, ref:'Product'})
  ProductId:string;

  @Prop({type:Boolean})
  active:boolean;

  @Prop({type:Types.ObjectId, ref:'Order'})
  OrderId:string;

  @Prop({type:Types.ObjectId, ref:'User'})
  UserId:string;

  @Prop({ type: Number})
  UnitPrice:number;

}

export const OrderdetailSchema = SchemaFactory.createForClass(Orderdetail);
