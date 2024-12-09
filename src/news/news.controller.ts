import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('test')
  async getArticles() {
    const articles = await this.newsService.testCron();
    return { articles };
  }

  @Post('article-data')
  async ArticleData(@Body() payload: { link: string }) {
    const data = await this.newsService.articleData(payload.link);
    return data;
  }
}
