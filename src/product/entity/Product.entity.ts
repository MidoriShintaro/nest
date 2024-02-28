import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { Category } from 'src/categories/entity/Categories.entity';
import { Brand } from 'src/brand/entity/Brand.entity'; 
import { Cart } from 'src/cart/entity/Cart.entity';
import { Voucher } from 'src/voucher/entity/Voucher.entity';
import { Review } from 'src/review/entity/Review.entity';
import { Orderdetail } from 'src/orderdetail/entity/Orderdetail.entity';
import { Guarantee } from 'src/Guarantee/entity/Guarantee.entity';


export type ProductDocument = HydratedDocument<Product>;

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
export class Product {
  @Prop({ type: String, required: true })
  productname: string;

  @Prop({ type: String, required: true })
  size: string;

  
  @Prop({ type: String, required: true })
  color: string;

  
  @Prop({ type: Number})
  numberstock: number;

  @Prop({ type: Number, required: true })
  price: number;

  
  @Prop({ type: String})
  description: string;

  @Prop({ type: Number})
  viewcount: number;

  @Prop({ type: String })
  image: string;
  
  @Prop({type: Types.ObjectId, ref:'Category', required:true})
  Category: string;

  @Prop({type: Types.ObjectId, ref:'Brand'})
  Brand: string;

  @Prop({type: Types.ObjectId, ref : 'Cart'})
  Cart: string;

  @Prop({type:[{type:Types.ObjectId, ref:'Voucher'}]})
  Vouchers: String[];

  @Prop({type:[{type:Types.ObjectId, ref:'Review'}]})
  Revies: String[];

  
  @Prop({type:Types.ObjectId, ref:'OrderDetial'})
  Orderdetail:Orderdetail;

  
  
  @Prop({type:Types.ObjectId, ref:'Guarantee'})
  Guarantee:Guarantee;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
