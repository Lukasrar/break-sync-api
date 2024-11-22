import { Body, Controller, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.schema';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async createNews(@Body() newsData: Partial<News>) {
    return this.newsService.create(newsData);
  }
}
