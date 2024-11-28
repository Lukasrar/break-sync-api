import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationController } from './push-notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PushNotification,
  PushNotificationSchema,
} from './push-notification.schema';

@Module({
  providers: [PushNotificationService],
  controllers: [PushNotificationController],
  imports: [
    MongooseModule.forFeature([
      { name: PushNotification.name, schema: PushNotificationSchema },
    ]),
  ],
})
export class PushNotificationModule {}
