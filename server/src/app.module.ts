import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DocumentsModule } from './documents/documents.module';
import { ProposalsModule } from './proposals/proposals.module';
import { EmailsModule } from './emails/emails.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [PrismaModule, AuthModule, DashboardModule, DocumentsModule, ProposalsModule, EmailsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
