import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class StudyCase extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  articlesUrl: string;
}

export const StudyCaseSchema = SchemaFactory.createForClass(StudyCase);
