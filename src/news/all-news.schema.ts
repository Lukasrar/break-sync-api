import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StudyCase } from 'src/study-case/study-case.schema';

@Schema()
export class AllNews extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop({ type: Types.ObjectId, ref: 'StudyCase', required: true })
  studyCase: StudyCase;
}

export const AllNewsSchema = SchemaFactory.createForClass(AllNews);
