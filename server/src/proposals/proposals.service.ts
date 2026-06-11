import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ProposalsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, data: {
    fieldOfStudy: string;
    researchInterest: string;
    problemStatement: string;
    methodology: string;
    expectedOutcome: string;
  }) {
    // Call AiService to generate the proposal content
    const generated = await this.aiService.generateProposal(data);

    // Save to the database
    return this.prisma.proposal.create({
      data: {
        userId,
        fieldOfStudy: data.fieldOfStudy,
        researchInterest: data.researchInterest,
        problemStatement: data.problemStatement,
        methodology: data.methodology,
        expectedOutcome: data.expectedOutcome,
        generatedTitle: generated.generatedTitle,
        background: generated.background,
        objectives: generated.objectives,
        detailedMethodology: generated.detailedMethodology,
        timeline: typeof generated.timeline === 'string' ? generated.timeline : JSON.stringify(generated.timeline),
        expectedResults: generated.expectedResults,
        clarityScore: generated.clarityScore,
        originalityScore: generated.originalityScore,
        feasibilityScore: generated.feasibilityScore,
        grammarScore: generated.grammarScore,
        feedbackRemarks: generated.feedbackRemarks,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findFirst({
      where: { id, userId },
    });
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }
    return proposal;
  }

  async remove(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findFirst({
      where: { id, userId },
    });
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }
    return this.prisma.proposal.delete({
      where: { id },
    });
  }
}
