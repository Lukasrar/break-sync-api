import { Controller, Get, Param, Post } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('test-news')
  async test() {
    return this.newsService.testCron();
  }

  @Get('get-by-profession/:profession')
  async getNewsByProfession(
    @Param('profession') profession: string,
  ): Promise<any[]> {
    return await this.newsService.getNewsByProfession(profession);
  }
}
