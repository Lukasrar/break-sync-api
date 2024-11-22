import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profession } from './profession.schema';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectModel(Profession.name)
    private readonly professionModel: Model<Profession>,
  ) {}

  async create(data: { name: string; description?: string }) {
    return await this.professionModel.create(data);
  }

  async findAll() {
    return await this.professionModel.find();
  }

  async update(id: string, data: Partial<Profession>) {
    return await this.professionModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string) {
    return await this.professionModel.findByIdAndDelete(id);
  }
}
