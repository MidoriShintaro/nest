import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/entity/Product.entity';
import { User } from 'src/user/entity/user.entity';

export type VoucherDocument = HydratedDocument<Voucher>;

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
export class Voucher {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({type: Number, required:true})
  value:Number;

  
  @Prop({type: String, required:true})
  type:String;

  @Prop({type:[{type:Types.ObjectId, ref:'Product'}]})
  Products:Product[];
  
  @Prop({type:[{type:Types.ObjectId, ref:'User'}]})
  User:User[];

}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
