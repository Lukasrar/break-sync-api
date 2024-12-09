import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('test')
  async TestCron() {
    const data = await this.newsService.test();
    return data;
  }

  @Post('article-data')
  async ArticleData(@Body() payload: { link: string }) {
    const data = await this.newsService.articleData(payload.link);
    return data;
  }

  @Post('list-articles-per-device')
  async ListArticlePerDivice(@Body() payload: { expoToken: string }) {
    const data = await this.newsService.listArticlePerDivice(payload.expoToken);
    return data;
  }
}
