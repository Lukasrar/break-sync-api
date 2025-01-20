import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AllNews, AllNewsSchema } from 'src/news/all-news.schema';
import { DailyNews, DailyNewsSchema } from 'src/news/daily-news.schema';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { Device, DeviceSchema } from './devices.schema';

@Module({
  providers: [DevicesService],
  controllers: [DevicesController],
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: AllNews.name, schema: AllNewsSchema },
      { name: DailyNews.name, schema: DailyNewsSchema },
    ]),
  ],
})
export class DevicesModule {}
