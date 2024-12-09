import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Device extends Document {
  @Prop({ required: true, unique: true })
  expoToken: string;

  @Prop({ type: Types.ObjectId, ref: 'StudyCase', required: true })
  studyCaseId: Types.ObjectId;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
