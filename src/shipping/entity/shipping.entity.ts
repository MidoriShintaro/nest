import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';

export type ShippingDocument = HydratedDocument<Shipping>;

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
export class Shipping {
  @Prop({ type: Number, required: true })
  value: Number;

  @Prop({type: Date, required:true})
  date:Date;

  
  @Prop({type: String, required:true})
  method:String;

  @Prop({type:Types.ObjectId, ref:'Order'})
  Order:string;

}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);
