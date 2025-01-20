import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Device } from 'src/devices/devices.schema';

@Schema()
export class DailyNews extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop({ type: [Types.ObjectId], ref: 'Device', required: true })
  devices: Device[];
}

export const DailyNewsSchema = SchemaFactory.createForClass(DailyNews);
