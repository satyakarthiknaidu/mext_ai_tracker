import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { ProposalsService } from './proposals.service';

@Controller('proposals')
@UseGuards(JwtAuthGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  async create(
    @ActiveUser() user: any,
    @Body() body: {
      fieldOfStudy: string;
      researchInterest: string;
      problemStatement: string;
      methodology: string;
      expectedOutcome: string;
    },
  ) {
    return this.proposalsService.create(user.sub, body);
  }

  @Get()
  async findAll(@ActiveUser() user: any) {
    return this.proposalsService.findAll(user.sub);
  }

  @Get(':id')
  async findOne(@ActiveUser() user: any, @Param('id') id: string) {
    return this.proposalsService.findOne(id, user.sub);
  }

  @Delete(':id')
  async remove(@ActiveUser() user: any, @Param('id') id: string) {
    return this.proposalsService.remove(id, user.sub);
  }
}
