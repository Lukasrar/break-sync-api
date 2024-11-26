import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AllNews, AllNewsSchema } from './all-news.schema';
import { DailyNews, DailyNewsSchema } from './daily-news.schema';
import { Profession, ProfessionSchema } from 'src/profession/profession.schema';

@Module({
  providers: [NewsService],
  controllers: [NewsController],
  imports: [
    MongooseModule.forFeature([
      { name: AllNews.name, schema: AllNewsSchema },
      { name: DailyNews.name, schema: DailyNewsSchema },
      { name: Profession.name, schema: ProfessionSchema },
    ]),
  ],
})
export class NewsModule {}
