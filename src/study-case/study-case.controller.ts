import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { StudyCaseService } from './study-case.service';
import { StudyCase } from './study-case.schema';

@Controller('study-case')
export class StudyCaseController {
  constructor(private readonly studyCaseService: StudyCaseService) {}

  @Post()
  async create(@Body() data: StudyCase) {
    return this.studyCaseService.create(data);
  }

  @Get()
  async findAll() {
    return this.studyCaseService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<StudyCase>) {
    return this.studyCaseService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studyCaseService.delete(id);
  }
}
