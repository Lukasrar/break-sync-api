import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Profession } from 'src/profession/profession.schema';

@Schema()
export class DailyNews extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  validUntil: Date;

  @Prop()
  description: string;

  @Prop()
  readingTimeMinutes: number;

  @Prop([String])
  tagList: string[];

  @Prop()
  authorName: string;

  @Prop({ required: true })
  id: number;

  @Prop({ type: Types.ObjectId, ref: 'Profession', required: true })
  profession: Profession;
}

export const DailyNewsSchema = SchemaFactory.createForClass(DailyNews);
