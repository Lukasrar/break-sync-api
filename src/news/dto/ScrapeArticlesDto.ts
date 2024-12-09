import { IsString, IsNotEmpty } from 'class-validator';

export class ScrapeArticlesDto {
  @IsString()
  @IsNotEmpty()
  expoToken: string;

  @IsString()
  @IsNotEmpty()
  studyCaseId: string;
}
