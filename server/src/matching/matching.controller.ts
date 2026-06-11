import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { MatchingService } from './matching.service';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  async getMatches(@ActiveUser() user: any) {
    return this.matchingService.getMatches(user.sub);
  }

  @Post('run')
  async runMatching(
    @ActiveUser() user: any,
    @Body('researchInterest') researchInterest: string,
  ) {
    return this.matchingService.runMatching(user.sub, researchInterest || 'Artificial Intelligence');
  }

  @Patch(':id')
  async updateStatus(
    @ActiveUser() user: any,
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.matchingService.updateMatchStatus(id, user.sub, body);
  }
}
