import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { DailyNews } from './daily-news.schema';
import { Profession } from 'src/profession/profession.schema';
import { sleep } from 'src/helpers/sleep';
import { getOneWeekAgo } from 'src/helpers/getOneWeekAgo';
import * as cheerio from 'cheerio';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    @InjectModel(DailyNews.name) private dailyNewsModel: Model<DailyNews>,
    @InjectModel(Profession.name) private professionModel: Model<Profession>,
  ) {}

  async testCron(): Promise<void> {
    await this.handleCronJob();
  }

  async fetchAndStorePosts(profession): Promise<any[]> {
    const url = 'https://dev.to/search/feed_content';

    const params = {
      per_page: 4,
      page: profession.lastFetchedPage,
      sort_by: 'public_reactions_count',
      sort_direction: 'desc',
      approved: '',
      class_name: 'Article',
      published_at: getOneWeekAgo(),
    };

    try {
      const response = await axios.get(url, { params });

      const articles = response.data.result;

      await this.updatePageForProfession(
        profession,
        profession.lastFetchedPage + 1,
      );

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

  async updatePageForProfession(profession, newPage: number): Promise<void> {
    await this.professionModel.updateOne(
      { name: profession.name },
      { $set: { lastFetchedPage: newPage } },
    );
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

  async scrapeArticles(
    keyword: string,
  ): Promise<{ title: string; link: string; html: string }[]> {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}+articles`;
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const $ = cheerio.load(data);
    const results = [];

    $('a').each((_, element) => {
      const link = $(element).attr('href');
      const title = $(element).text();

      // Filtra apenas links úteis
      if (link?.includes('http') && title) {
        results.push({ title, link });
      }
    });

    // Obtém HTML dos artigos (opcional: pode filtrar os top N links)
    const articles = await Promise.all(
      results.slice(0, 5).map(async (item) => {
        try {
          const { data: html } = await axios.get(item.link);
          return { ...item, html };
        } catch {
          return null;
        }
      }),
    );

    const test = articles.filter(Boolean);
    console.log(test);

    return articles.filter(Boolean);
  }
}
