import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeadlinesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.deadline.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async create(userId: string, data: { title: string; description?: string; dueDate: string }) {
    return this.prisma.deadline.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
      },
    });
  }

  async update(id: string, userId: string, data: { title?: string; description?: string; dueDate?: string; completed?: boolean }) {
    const deadline = await this.prisma.deadline.findFirst({
      where: { id, userId },
    });
    if (!deadline) {
      throw new NotFoundException('Deadline not found');
    }

    return this.prisma.deadline.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        completed: data.completed,
      },
    });
  }

  async remove(id: string, userId: string) {
    const deadline = await this.prisma.deadline.findFirst({
      where: { id, userId },
    });
    if (!deadline) {
      throw new NotFoundException('Deadline not found');
    }

    return this.prisma.deadline.delete({
      where: { id },
    });
  }
}
