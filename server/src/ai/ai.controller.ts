import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze-sop')
  async analyzeSOP(@Body('sopText') sopText: string) {
    return this.aiService.analyzeSOP(sopText);
  }

  @Post('analyze-resume')
  async analyzeResume(@Body('resumeText') resumeText: string) {
    return this.aiService.analyzeResume(resumeText);
  }
}
