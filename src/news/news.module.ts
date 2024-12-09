import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyNews, DailyNewsSchema } from './daily-news.schema';
import { StudyCase, StudyCaseSchema } from 'src/study-case/study-case.schema';

@Module({
  providers: [NewsService],
  controllers: [NewsController],
  imports: [
    MongooseModule.forFeature([
      { name: DailyNews.name, schema: DailyNewsSchema },
      { name: StudyCase.name, schema: StudyCaseSchema },
    ]),
  ],
})
export class NewsModule {}
