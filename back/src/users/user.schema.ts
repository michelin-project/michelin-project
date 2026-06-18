import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  name?: string;

  @Prop()
  archetypeName?: string;

  @Prop({ default: 0 })
  scores?: number;

  @Prop({ type: Object })
  answers?: any;
}

export const UserSchema = SchemaFactory.createForClass(User);