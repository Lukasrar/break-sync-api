import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './news.schema';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async create(newsData: Partial<News>): Promise<void> {
    console.log(newsData);
    await this.handleCronJob();
  }

  async fetchAndStoreDevToPosts(): Promise<void> {
    const url = 'https://dev.to/api/articles?page=1&per_page=5';

    try {
      this.logger.log('Fetching posts from Dev.to...');

      const response = await axios.get(url);
      const articles = response.data;

      const curatedArticles = articles.filter(
        (article) => article.positive_reactions_count > 50,
      );

      console.log(curatedArticles);

      const formattedArticles = curatedArticles.map((article: any) => ({
        title: article.title,
        validUntil: new Date(article.published_at),
        description: article.description || '',
        readingTimeMinutes: article.reading_time_minutes,
        tagList: article.tag_list || [],
        authorName: article.user.name,
        id: article.id,
      }));

      await this.newsModel.insertMany(formattedArticles);
      this.logger.log('Posts successfully stored in the database.');
    } catch (error) {
      this.logger.error(
        'Failed to fetch or store posts from Dev.to',
        error.message,
      );
    }
  }

  @Cron('0 6 * * *')
  async handleCronJob(): Promise<void> {
    await this.fetchAndStoreDevToPosts();
  }
}
