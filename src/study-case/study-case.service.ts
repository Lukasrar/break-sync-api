import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudyCase } from './study-case.schema';

@Injectable()
export class StudyCaseService {
  constructor(
    @InjectModel(StudyCase.name)
    private readonly studyCaseModel: Model<StudyCase>,
  ) {}

  async create(data: { name: string; description?: string }) {
    return await this.studyCaseModel.create(data);
  }

  async findAll() {
    return await this.studyCaseModel.find();
  }

  async update(id: string, data: Partial<StudyCase>) {
    return await this.studyCaseModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string) {
    return await this.studyCaseModel.findByIdAndDelete(id);
  }
}
