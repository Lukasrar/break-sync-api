import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProfessionService } from './profession.service';

@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  @Post()
  async create(@Body() data: { name: string }) {
    return this.professionService.create(data);
  }

  @Get()
  async findAll() {
    return this.professionService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<{ name: string }>,
  ) {
    return this.professionService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.professionService.delete(id);
  }
}
