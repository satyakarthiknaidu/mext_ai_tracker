import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UniversitiesService } from './universities.service';

@Controller('universities')
@UseGuards(JwtAuthGuard)
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('field') field?: string,
  ) {
    return this.universitiesService.findAll({ search, field });
  }
}
