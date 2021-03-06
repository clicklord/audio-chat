import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Chat {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: string[];

  @Prop(
    raw([
      {
        userId: { type: String },
        userKey: { type: String },
      },
    ]),
  )
  activeUsers: { userId: string; userKey: string }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
