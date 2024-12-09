import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PushNotification } from './push-notification.schema';
import { Model } from 'mongoose';
import { StudyCase } from 'src/study-case/study-case.schema';
import axios from 'axios';
import { AllNews } from 'src/news/all-news.schema';
import { DailyNews } from 'src/news/daily-news.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  constructor(
    @InjectModel(PushNotification.name)
    private readonly pushNotificationModel: Model<PushNotification>,

    @InjectModel(AllNews.name) private allNewsModel: Model<AllNews>,
    @InjectModel(DailyNews.name) private dailyNewsModel: Model<DailyNews>,
  ) {}

  async create(data: { expoToken: string; studyCase: Partial<StudyCase> }) {
    return await this.pushNotificationModel.create(data);
  }

  async list() {
    return await this.pushNotificationModel.find();
  }

  @Cron('0 9,11,13,15,17 * * *', {
    timeZone: 'America/Sao_Paulo',
  })
  async sendNotificationToAll() {
    this.logger.log('Tarefa executada a cada 1 minuto');

    const devices = await this.pushNotificationModel.find().exec();

    const currentNewsToBeSended = await this.dailyNewsModel.findOneAndDelete();

    if (!currentNewsToBeSended) return;

    const expoTokens = devices.map((device) => device.expoToken);

    if (expoTokens.length === 0) return;

    const message = {
      to: expoTokens,
      title: currentNewsToBeSended.title,
      body: 'Você recebeu um novo artigo!',
      data: currentNewsToBeSended,
    };

    try {
      await axios.post('https://exp.host/--/api/v2/push/send', message, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const itemToInsert = currentNewsToBeSended.toObject();
      delete itemToInsert._id;

      await this.allNewsModel.create(itemToInsert);
    } catch (error) {
      console.error('Erro ao enviar notificação', error);
    }
  }
}
