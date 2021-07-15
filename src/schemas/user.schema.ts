import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  collection: 'user',
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class User {
  @Prop({ type: String, text: true, required: true })
  name: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.path('name').index({ text: true });
