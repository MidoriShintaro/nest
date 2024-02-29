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
  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({type: Number, required:true})
  rate: number;

  @Prop({type:Types.ObjectId, ref : 'Product'})
  Product: string;

  
  @Prop({type:Types.ObjectId, ref : 'User'})
  User: string;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);
