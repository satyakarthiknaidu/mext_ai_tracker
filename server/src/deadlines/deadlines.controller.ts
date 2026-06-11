import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { DeadlinesService } from './deadlines.service';

@Controller('deadlines')
@UseGuards(JwtAuthGuard)
export class DeadlinesController {
  constructor(private readonly deadlinesService: DeadlinesService) {}

  @Get()
  async findAll(@ActiveUser() user: any) {
    return this.deadlinesService.findAll(user.sub);
  }

  @Post()
  async create(
    @ActiveUser() user: any,
    @Body() body: { title: string; description?: string; dueDate: string },
  ) {
    return this.deadlinesService.create(user.sub, body);
  }

  @Patch(':id')
  async update(
    @ActiveUser() user: any,
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; dueDate?: string; completed?: boolean },
  ) {
    return this.deadlinesService.update(id, user.sub, body);
  }

  @Delete(':id')
  async remove(@ActiveUser() user: any, @Param('id') id: string) {
    return this.deadlinesService.remove(id, user.sub);
  }
}
