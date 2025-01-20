import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class RegisterDeviceDto {
  @IsString()
  @IsNotEmpty()
  expoToken: string;

  @IsString()
  @IsNotEmpty()
  studyCaseId: Types.ObjectId;
}
