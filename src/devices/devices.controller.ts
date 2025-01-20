import { Body, Controller, Get, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/RegisterDeviceDto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register-device-token')
  async registerToken(@Body() data: RegisterDeviceDto) {
    return await this.devicesService.createOrUpdate(data);
  }

  @Get('list-devices')
  async listDevices() {
    return await this.devicesService.list();
  }

  @Post('send-notification-to-all')
  async sendNotificationToAll() {
    return await this.devicesService.sendNotificationToAll();
  }
}
