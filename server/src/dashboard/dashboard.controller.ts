import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async getSummary(@ActiveUser() user: any) {
    const userId = user.sub;

    // Get documents count
    const docs = await this.prisma.document.findMany({
      where: { userId },
    });
    const totalRequiredDocs = 6;
    const uploadedDocsCount = docs.length;

    // Get highest proposal score
    const proposals = await this.prisma.proposal.findMany({
      where: { userId },
      orderBy: { clarityScore: 'desc' },
      take: 1,
    });
    const maxScore = proposals[0]?.clarityScore || 0;

    // Get closest deadline
    const deadlines = await this.prisma.deadline.findMany({
      where: { userId, completed: false },
      orderBy: { dueDate: 'asc' },
      take: 1,
    });
    const nextDeadline = deadlines[0]?.dueDate
      ? new Date(deadlines[0].dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'June 20, 2026';

    const completionPercent = Math.min(
      Math.round(((uploadedDocsCount + (maxScore ? 1 : 0)) / (totalRequiredDocs + 1)) * 100),
      100
    ) || 30; // base completion

    return {
      profileCompletion: completionPercent,
      applicationStatus: docs.length > 3 ? 'Document Screening In Progress' : 'Incomplete Application',
      documentsCount: `${uploadedDocsCount}/${totalRequiredDocs}`,
      proposalScore: maxScore || 80, // Default initial indicator
      upcomingDeadline: nextDeadline,
      unreadNotifications: 2,
    };
  }
}
