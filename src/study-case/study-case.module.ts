import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyCaseService } from './study-case.service';
import { StudyCase, StudyCaseSchema } from './study-case.schema';
import { StudyCaseController } from './study-case.controller';

@Module({
  providers: [StudyCaseService],
  controllers: [StudyCaseController],
  imports: [
    MongooseModule.forFeature([
      { name: StudyCase.name, schema: StudyCaseSchema },
    ]),
  ],
})
export class StudyCaseModule {}
