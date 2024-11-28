import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Profession } from 'src/profession/profession.schema';

@Schema()
export class PushNotification extends Document {
  @Prop({ required: true, unique: true })
  expoToken: string;

  @Prop({ type: Types.ObjectId, ref: 'Profession', required: true })
  profession: Profession;
}

export const PushNotificationSchema =
  SchemaFactory.createForClass(PushNotification);
