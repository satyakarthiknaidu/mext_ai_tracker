import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  async getMatches(userId: string) {
    return this.prisma.professorMatch.findMany({
      where: { userId },
      include: { professor: true },
      orderBy: { matchScore: 'desc' },
    });
  }

  async runMatching(userId: string, researchInterest: string) {
    // Get all professors
    const professors = await this.prisma.professor.findMany();
    
    // Clean existing matches for this user
    await this.prisma.professorMatch.deleteMany({
      where: { userId },
    });

    const matches: any[] = [];

    for (const prof of professors) {
      // Basic keyword match score calculation
      let score = 50; // base score
      
      // Check keyword overlap
      const keywords = prof.keywords.split(',').map(k => k.trim().toLowerCase());
      const interest = researchInterest.toLowerCase();
      
      let matchesCount = 0;
      for (const kw of keywords) {
        if (interest.includes(kw) || kw.includes(interest)) {
          matchesCount++;
        }
      }
      
      score += matchesCount * 15;
      
      const resArea = prof.researchArea.toLowerCase();
      if (resArea.includes(interest) || interest.includes(resArea)) {
        score += 20;
      }
      
      score = Math.min(score, 98); // cap at 98%
      score = Math.max(score, 40); // floor at 40%

      // Create match
      const match = await this.prisma.professorMatch.create({
        data: {
          userId,
          professorId: prof.id,
          matchScore: score,
          status: 'PENDING',
          notes: `AI Match based on alignment with research interest: "${researchInterest}". Keyword alignment matches: ${matchesCount}.`,
        },
        include: {
          professor: true,
        },
      });
      matches.push(match);
    }

    // Sort matches by score desc
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  async updateMatchStatus(id: string, userId: string, data: { status: string; notes?: string }) {
    const match = await this.prisma.professorMatch.findFirst({
      where: { id, userId },
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return this.prisma.professorMatch.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes !== undefined ? data.notes : undefined,
      },
      include: {
        professor: true,
      },
    });
  }
}
