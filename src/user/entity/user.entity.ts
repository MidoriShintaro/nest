import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret.password;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class User {
  @Prop({ type: String, unique: true, required: true })
  username: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    min: [8, 'Password must be at least 8 characters'],
  })
  password: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({
    type: String,
    default: UserRole.USER,
    enum: {
      values: ['USER', 'ADMIN', 'MODERATOR'],
      message: 'Roles only have user or admin or moderator',
    },
  })
  role: string;



  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] })
  Reviews: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Voucher' }] })
  Vouchers: string[];

  @Prop({ type: Types.ObjectId, ref: 'Adress' })
  address: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
  OrderIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
