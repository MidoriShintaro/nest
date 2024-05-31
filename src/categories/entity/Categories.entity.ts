import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument,Types } from 'mongoose';

import { prependListener } from 'process';
import { types } from 'util';
import { Product } from 'src/product/entity/Product.entity';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id
      delete ret.__v;
    },
  },
})
export class Category {
  @Prop({ type: String, required: true })
  categoryname: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({type:[{type: Types.ObjectId, ref :'Product'}]})
  Products:string[];

}

export const CategorySchema = SchemaFactory.createForClass(Category);
