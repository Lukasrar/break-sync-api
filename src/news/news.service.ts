import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { DailyNews } from './daily-news.schema';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { StudyCase } from 'src/study-case/study-case.schema';
import { sleep } from 'src/helpers/sleep';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    @InjectModel(DailyNews.name) private dailyNewsModel: Model<DailyNews>,
    @InjectModel(StudyCase.name) private studyCaseModel: Model<StudyCase>,
  ) {}

  async testCron(): Promise<void> {
    await this.handleCronJob();
  }

  @Cron('0 6 * * *')
  async handleCronJob(): Promise<void> {
    this.logger.log('Starting daily news cron job...');

    const studyCases = await this.studyCaseModel.find().exec();

    for (const studyCase of studyCases) {
      console.log(studyCase);
      const articles = await this.scrapeArticles(studyCase);
      console.log(articles);

      const formattedArticles = articles.map((article) => ({
        title: article.title,
        link: article.link,
        studyCase,
      }));

      if (articles.length > 0) {
        await this.dailyNewsModel.insertMany(formattedArticles);
      }

      await sleep(2000);
    }

    this.logger.log('Daily news cron job completed.');
  }

  async scrapeArticles(
    studyCase: StudyCase,
  ): Promise<{ title: string; link: string }[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(studyCase.articlesUrl, {
      waitUntil: 'networkidle2',
    });

    const content = await page.content();

    const $ = cheerio.load(content);
    const articles: { title: string; link: string }[] = [];

    $('a').each((_, element) => {
      const href = $(element).attr('href')?.trim();
      const text = $(element).text().trim();

      const currentUrl = page.url();
      const currentDomain = new URL(currentUrl).hostname;

      if (text.length > 20 && href) {
        let fullLink = href;

        if (!href.startsWith('http')) {
          if (href.startsWith('/')) {
            fullLink = `https://${currentDomain}${href}`;
          }
        }

        const linkDomain = new URL(fullLink).hostname;
        if (linkDomain.includes(currentDomain)) {
          articles.push({
            title: text,
            link: fullLink,
          });
        }
      }
    });

    await browser.close();
    return articles.slice(0, 4);
  }

  async articleData(link: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(link, {
      waitUntil: 'networkidle2',
    });

    const content = await page.content();

    const $ = cheerio.load(content);

    const article = {
      title: '',
      content: '',
      link: link,
    };

    const articleElement = $('article').first();

    if (articleElement.length > 0) {
      article.content = articleElement.html().trim(); // Captura todo o HTML dentro da tag <article>
    }

    await browser.close();

    // Retorna os dados do artigo
    return article;
  }
}
