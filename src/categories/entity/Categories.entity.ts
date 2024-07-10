import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

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
export class Category {
  @Prop({ type: String, required: true })
  categoryName: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
