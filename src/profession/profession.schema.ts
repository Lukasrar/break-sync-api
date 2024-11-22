import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Profession extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const ProfessionSchema = SchemaFactory.createForClass(Profession);
