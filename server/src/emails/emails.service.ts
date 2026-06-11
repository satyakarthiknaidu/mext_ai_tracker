import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EmailsService {
  constructor(private readonly aiService: AiService) {}

  async generate(inputs: {
    category: string;
    professorName?: string;
    university?: string;
    researchInterest?: string;
    studentName: string;
    background?: string;
  }) {
    return this.aiService.generateEmail(inputs);
  }
}
