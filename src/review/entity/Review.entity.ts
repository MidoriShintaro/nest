import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
import { Product } from 'src/product/entity/Product.entity';

export type ReviewDocument = HydratedDocument<Review>;

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
export class Review {
  @Prop({ type: String})
  comment: string;

  @Prop({ type: String})
  image: string;

  @Prop({type: Number})
  rate: number;

  @Prop({type:Types.ObjectId, ref : 'Product'})
  productId: string;

  
  @Prop({type:Types.ObjectId, ref : 'User'})
  userId: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
