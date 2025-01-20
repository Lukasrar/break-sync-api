import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyNews } from './daily-news.schema';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { StudyCase } from 'src/study-case/study-case.schema';
import { Cron } from '@nestjs/schedule';
import { Device } from 'src/devices/devices.schema';
import { AllNews } from './all-news.schema';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    @InjectModel(DailyNews.name) private dailyNewsModel: Model<DailyNews>,
    @InjectModel(AllNews.name) private allNewsModel: Model<AllNews>,
    @InjectModel(StudyCase.name) private studyCaseModel: Model<StudyCase>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {}

  async test(): Promise<void> {
    await this.handleScrapeArticles();
  }

  @Cron('0 6 * * *')
  async handleScrapeArticles(): Promise<void> {
    const devices = await this.deviceModel.find().exec();
    const oldNews = await this.dailyNewsModel.find().exec();

    await this.dailyNewsModel.deleteMany();
    await this.allNewsModel.insertMany(oldNews);

    const groupedDevices = devices.reduce(
      (acc, device) => {
        const studyCaseId = device.studyCaseId.toString();

        if (!acc[studyCaseId]) {
          acc[studyCaseId] = [];
        }

        acc[studyCaseId].push(device);

        return acc;
      },
      {} as Record<string, typeof devices>,
    );

    for (const studyCaseId in groupedDevices) {
      const studyCaseDevices = groupedDevices[studyCaseId];

      const studyCase = await this.studyCaseModel
        .findOne({ _id: studyCaseId })
        .exec();

      if (!studyCase) continue;

      const articles = await this.scrapeArticles(studyCase);

      if (articles.length === 0) return;

      const formattedArticles = articles.map((article) => ({
        title: article.title,
        link: article.link,
        studyCase: studyCase,
        devices: studyCaseDevices,
      }));

      await this.dailyNewsModel.insertMany(formattedArticles);
    }
  }

  async scrapeArticles(
    studyCase: StudyCase,
  ): Promise<{ title: string; link: string }[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(studyCase.articlesUrl, {
      waitUntil: 'domcontentloaded', // ou 'networkidle0'
    });

    await page.waitForSelector('a');

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
      article.content = articleElement.html().trim();
    }

    await browser.close();

    return article;
  }

  async listArticlePerDivice(expoToken: string) {
    const articles = await this.dailyNewsModel
      .find({
        devices: { $elemMatch: { expoToken } },
      })
      .select('-devices')
      .exec();

    return articles;
  }
}
