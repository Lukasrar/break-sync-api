import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionModule } from './profession/profession.module';
import { PushNotificationModule } from './push-notification/push-notification.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/break-sync-db'),
    NewsModule,
    ProfessionModule,
    PushNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
