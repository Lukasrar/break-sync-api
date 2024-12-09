import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { StudyCaseModule } from './study-case/study-case.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/break-sync-db'),
    NewsModule,
    StudyCaseModule,
    DevicesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
