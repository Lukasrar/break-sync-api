import { Body, Controller, Get, Post } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotification } from './push-notification.schema';

@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post('register-token')
  async registerToken(@Body() data: PushNotification) {
    return await this.pushNotificationService.create(data);
  }

  @Get('list-tokens')
  async listTokens() {
    return await this.pushNotificationService.list();
  }

  @Post('send-notification-to-all')
  async sendNotificationToAll() {
    return await this.pushNotificationService.sendNotificationToAll();
  }
}
