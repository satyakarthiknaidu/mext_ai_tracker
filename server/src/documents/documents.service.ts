import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, file: Express.Multer.File, type: string) {
    // Generate static local download URL
    const url = `/api/documents/download/${file.filename}`;

    return this.prisma.document.create({
      data: {
        userId,
        name: file.originalname,
        type,
        url,
        status: 'PENDING',
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id, userId },
    });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    return doc;
  }

  async remove(id: string, userId: string) {
    const doc = await this.findOne(id, userId);

    // Delete local file if it exists
    const filename = doc.url.split('/').pop();
    if (filename) {
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }
}
