import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { Device } from './devices.schema';
import { RegisterDeviceDto } from './dto/RegisterDeviceDto';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<Device>,
  ) {}

  async createOrUpdate(data: RegisterDeviceDto) {
    const existingDevice = await this.deviceModel.findOne({
      expoToken: data.expoToken,
    });

    if (existingDevice) {
      if (!existingDevice.studyCaseId.equals(data.studyCaseId)) {
        existingDevice.studyCaseId = new Types.ObjectId(data.studyCaseId);

        await existingDevice.save();
        return { message: 'StudyCaseId updated successfully', statusCode: 200 };
      }

      return { message: 'Token already registered', statusCode: 200 };
    }

    await this.deviceModel.create(data);
    return { message: 'Device registered successfully', statusCode: 201 };
  }

  async list() {
    return await this.deviceModel.find();
  }

  @Cron('0 9,11,13,15,17 * * *', {
    timeZone: 'America/Sao_Paulo',
  })
  async sendNotificationToAll() {
    const devices = await this.deviceModel.find().exec();

    const expoTokens = devices.map((device) => device.expoToken);

    if (expoTokens.length === 0) return;

    const message = {
      to: expoTokens,
      title: 'You have a new article to read',
      body: 'Do a break sync',
    };

    try {
      await axios.post('https://exp.host/--/api/v2/push/send', message, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Erro ao enviar notificação', error);
    }
  }
}
