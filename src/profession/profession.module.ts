import { Module } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { ProfessionController } from './profession.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profession, ProfessionSchema } from './profession.schema';

@Module({
  providers: [ProfessionService],
  controllers: [ProfessionController],
  imports: [
    MongooseModule.forFeature([
      { name: Profession.name, schema: ProfessionSchema },
    ]),
  ],
})
export class ProfessionModule {}
