import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { DocumentsService } from './documents.service';
import { diskStorage } from 'multer';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

// Configure Multer storage
const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
      cb(null, uniqueSuffix);
    },
  }),
};

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @ActiveUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    if (!file) {
      throw new NotFoundException('File upload failed');
    }
    return this.documentsService.create(user.sub, file, type);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDocuments(@ActiveUser() user: any) {
    return this.documentsService.findAll(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDocument(@ActiveUser() user: any, @Param('id') id: string) {
    return this.documentsService.remove(id, user.sub);
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: express.Response) {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return res.sendFile(filePath);
  }
}
