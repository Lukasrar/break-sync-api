import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationController } from './push-notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PushNotification,
  PushNotificationSchema,
} from './push-notification.schema';
import { AllNews, AllNewsSchema } from 'src/news/all-news.schema';
import { DailyNews, DailyNewsSchema } from 'src/news/daily-news.schema';

@Module({
  providers: [PushNotificationService],
  controllers: [PushNotificationController],
  imports: [
    MongooseModule.forFeature([
      { name: PushNotification.name, schema: PushNotificationSchema },
      { name: AllNews.name, schema: AllNewsSchema },
      { name: DailyNews.name, schema: DailyNewsSchema },
    ]),
  ],
})
export class PushNotificationModule {}
