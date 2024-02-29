import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/entity/Product.entity';

export type GuaranteeDocument = HydratedDocument<Guarantee>;

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
export class Guarantee {
 

  @Prop({ type: Number })
  timeguarantee: Number;

  @Prop({type: Boolean, required:true})
  guarantee:boolean;

  @Prop({type:Types.ObjectId, ref:'Product'})
  Product : string;

}

export const GuaranteeSchema = SchemaFactory.createForClass(Guarantee);
