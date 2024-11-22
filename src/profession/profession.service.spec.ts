import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionService } from './profession.service';

describe('ProfessionService', () => {
  let service: ProfessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionService],
    }).compile();

    service = module.get<ProfessionService>(ProfessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
