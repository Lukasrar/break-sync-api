import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { DailyNews } from './daily-news.schema';
import { AllNews } from './all-news.schema';
import { Profession } from 'src/profession/profession.schema';
import { sleep } from 'src/helpers/sleep';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    @InjectModel(DailyNews.name) private dailyNewsModel: Model<DailyNews>,
    @InjectModel(AllNews.name) private allNewsModel: Model<AllNews>,
    @InjectModel(Profession.name) private professionModel: Model<Profession>,
  ) {}

  async testCron(): Promise<void> {
    await this.handleCronJob();
  }

  async fetchAndStorePosts(profession): Promise<any[]> {
    const url = `https://dev.to/api/articles?page=1&per_page=5`;

    try {
      this.logger.log('Fetching posts from Dev.to...');
      this.logger.log(url);

      const response = await axios.get(url, { params: profession.tags });
      const articles = response.data;

      const curatedArticles = articles.filter(
        (article) => article.positive_reactions_count > 10,
      );

      console.log(curatedArticles);
      this.logger.log('Posts successfully stored in the database.');

      return articles.map((article: any) => ({
        title: article.title,
        validUntil: new Date(),
        description: article.description || '',
        readingTimeMinutes: article.reading_time_minutes,
        tagList: article.tag_list || [],
        authorName: article.user.name,
        id: article.id,
        profession: profession.name,
      }));
    } catch (error) {
      this.logger.error(
        'Failed to fetch or store posts from Dev.to',
        error.message,
      );
      return [];
    }
  }

  @Cron('0 6 * * *')
  async handleCronJob(): Promise<void> {
    this.logger.log('Starting daily news cron job...');

    const oldNews = await this.dailyNewsModel.find().exec();

    if (oldNews.length > 0) {
      await this.allNewsModel.insertMany(oldNews);
      await this.dailyNewsModel.deleteMany({});
      this.logger.log('Migrated daily news to allNews and cleared dailyNews.');
    }

    const professions = await this.professionModel.find().exec();

    for (const profession of professions) {
      const newsForProfession = await this.fetchAndStorePosts(profession);

      if (newsForProfession.length > 0) {
        await this.dailyNewsModel.insertMany(newsForProfession);
        this.logger.log(
          `Stored ${newsForProfession.length} articles for profession: ${profession.name}`,
        );
      }

      await sleep(2000);
    }

    this.logger.log('Daily news cron job completed.');
  }

  async getNewsByProfession(profession: string): Promise<any[]> {
    return await this.dailyNewsModel.find({ profession }).exec();
  }

  async getArticleDetails(articleId: number): Promise<any[]> {
    const response = await axios.get(
      `https://dev.to/api/articles/${articleId}`,
    );
    return response.data;
  }
}
