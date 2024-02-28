import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/entity/Product.entity';
export type BrandDocument = HydratedDocument<Brand>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  }
})
export class Brand {
  @Prop({ type: String, required: true })
  brandname: string;

  @Prop({type:[{type:Types.ObjectId, ref:'Product'}]})
  Products : Product[];



}

export const BrandSchema = SchemaFactory.createForClass(Brand);
