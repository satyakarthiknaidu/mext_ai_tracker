import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailsService } from './emails.service';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('generate')
  async generate(
    @Body() body: {
      category: string;
      professorName?: string;
      university?: string;
      researchInterest?: string;
      studentName: string;
      background?: string;
    },
  ) {
    return this.emailsService.generate(body);
  }
}
