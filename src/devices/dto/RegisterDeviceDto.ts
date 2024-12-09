import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  @IsNotEmpty()
  expoToken: string;

  @IsString()
  @IsNotEmpty()
  studyCaseId: string;
}
