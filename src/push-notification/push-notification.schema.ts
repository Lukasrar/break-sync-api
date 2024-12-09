import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StudyCase } from 'src/study-case/study-case.schema';

@Schema()
export class PushNotification extends Document {
  @Prop({ required: true, unique: true })
  expoToken: string;

  @Prop({ type: Types.ObjectId, ref: 'StudyCase', required: true })
  studyCase: StudyCase;
}

export const PushNotificationSchema =
  SchemaFactory.createForClass(PushNotification);
