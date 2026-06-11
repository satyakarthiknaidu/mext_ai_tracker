import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { search?: string; field?: string }) {
    const where: any = {};
    
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search } },
        { location: { contains: query.search } },
      ];
    }

    if (query?.field) {
      where.field = { contains: query.field };
    }

    return this.prisma.university.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }
}
