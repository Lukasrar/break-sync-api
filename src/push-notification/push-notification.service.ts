import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PushNotification } from './push-notification.schema';
import { Model } from 'mongoose';
import { Profession } from 'src/profession/profession.schema';

@Injectable()
export class PushNotificationService {
  constructor(
    @InjectModel(PushNotification.name)
    private readonly pushNotificationModel: Model<PushNotification>,
  ) {}

  async create(data: { expoToken: string; profession: Partial<Profession> }) {
    return await this.pushNotificationModel.create(data);
  }

  async list() {
    return await this.pushNotificationModel.find().populate('profession');
  }
}
