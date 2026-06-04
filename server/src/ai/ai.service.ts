import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('Gemini API Client Initialized successfully.');
    } else {
      this.logger.warn('GEMINI_API_KEY is not defined. Using mock fallback generators.');
    }
  }

  private cleanJson(text: string): string {
    return text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  }

  async generateProposal(inputs: {
    fieldOfStudy: string;
    researchInterest: string;
    problemStatement: string;
    methodology: string;
    expectedOutcome: string;
  }) {
    if (!this.genAI) {
      return this.getMockProposal(inputs);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an elite academic advisor. Based on the following inputs from a MEXT Scholarship applicant:
- Field of Study: ${inputs.fieldOfStudy}
- Research Interest: ${inputs.researchInterest}
- Problem Statement: ${inputs.problemStatement}
- Methodology: ${inputs.methodology}
- Expected Outcome: ${inputs.expectedOutcome}

Generate a fully structured research proposal. Return ONLY a valid JSON object matching the following structure (do not include any additional commentary or text):
{
  "generatedTitle": "A concise academic title",
  "background": "A comprehensive literature background (2 paragraphs)",
  "objectives": "Specific, measurable research objectives",
  "detailedMethodology": "A detailed methodology outlining the experimental steps",
  "timeline": "A JSON list or descriptive text of the 2-year research plan milestones",
  "expectedResults": "What results and contributions this research will achieve",
  "clarityScore": 80, // Number between 0 and 100
  "originalityScore": 85, // Number between 0 and 100
  "feasibilityScore": 75, // Number between 0 and 100
  "grammarScore": 90, // Number between 0 and 100
  "feedbackRemarks": "Constructive feedback remarks about how to improve this proposal for Japanese universities"
}`;

      const result = await model.generateContent(prompt);
      const text = this.cleanJson(result.response.text());
      return JSON.parse(text);
    } catch (error) {
      this.logger.error('Gemini generateProposal failed. Using mock fallback.', error);
      return this.getMockProposal(inputs);
    }
  }

  async generateEmail(inputs: {
    category: string;
    professorName?: string;
    university?: string;
    researchInterest?: string;
    studentName: string;
    background?: string;
  }) {
    if (!this.genAI) {
      return this.getMockEmail(inputs);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Write a highly professional academic email.
Category: ${inputs.category}
Professor Name: ${inputs.professorName || 'Professor'}
University: ${inputs.university || 'Japanese University'}
Research Interest: ${inputs.researchInterest || 'your lab'}
Student Name: ${inputs.studentName}
Student Background: ${inputs.background || 'Computer Science Graduate'}

Return only the email subject line and body. No other text.`;

      const result = await model.generateContent(prompt);
      return { emailBody: result.response.text().trim() };
    } catch (error) {
      this.logger.error('Gemini generateEmail failed. Using mock fallback.', error);
      return this.getMockEmail(inputs);
    }
  }

  async analyzeSOP(sopText: string) {
    if (!this.genAI) {
      return this.getMockSopAnalysis();
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this Statement of Purpose (SOP) draft for a MEXT Scholarship applicant. 
SOP Text:
${sopText}

Evaluate and return ONLY a valid JSON object matching the following structure:
{
  "score": 85, // Number between 0 and 100
  "grammarFeedback": "Feedback on grammar, spelling and punctuation",
  "structureFeedback": "Feedback on document structure, transition flow, and narrative cohesion",
  "alignmentFeedback": "How well the research matches typical Japanese university criteria",
  "toneFeedback": "Feedback on academic professionalism and vocabulary choice",
  "suggestions": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2"
  ]
}`;
      const result = await model.generateContent(prompt);
      const text = this.cleanJson(result.response.text());
      return JSON.parse(text);
    } catch (error) {
      this.logger.error('Gemini analyzeSOP failed. Using mock fallback.', error);
      return this.getMockSopAnalysis();
    }
  }

  async analyzeResume(resumeText: string) {
    if (!this.genAI) {
      return this.getMockResumeAnalysis();
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this resume content for a MEXT Scholarship applicant:
${resumeText}

Evaluate the applicant's experience, certifications, and projects. Return ONLY a valid JSON object matching the following structure:
{
  "score": 78, // Number between 0 and 100
  "skillsIdentified": ["Skill A", "Skill B"],
  "missingSkills": ["Recommended skill 1", "Recommended skill 2"],
  "suggestions": [
    "Add more details on scientific publications",
    "Highlight specific technical stack details"
  ]
}`;
      const result = await model.generateContent(prompt);
      const text = this.cleanJson(result.response.text());
      return JSON.parse(text);
    } catch (error) {
      this.logger.error('Gemini analyzeResume failed. Using mock fallback.', error);
      return this.getMockResumeAnalysis();
    }
  }

  private getMockProposal(inputs: any) {
    return {
      generatedTitle: `Optimization of ${inputs.researchInterest || 'Target Domain'} using Advanced Machine Learning`,
      background: `The field of ${inputs.fieldOfStudy} has recently seen rapid growth due to standard developments. However, applying these strategies to ${inputs.researchInterest} faces major bottlenecks: ${inputs.problemStatement}. Traditional methods fall short due to resource limitations. This research proposal reviews key challenges and implements active, robust solutions.`,
      objectives: `1. Implement a comprehensive testing model to analyze ${inputs.researchInterest}.\n2. Build a baseline benchmark for comparing experimental outcomes.\n3. Validate the proposed strategy in real-world scenarios.`,
      detailedMethodology: `Our methodology consists of three main phases:\nPhase 1: Data extraction and pre-processing using modern models.\nPhase 2: Algorithm implementation applying ${inputs.methodology}.\nPhase 3: Validation and parameter tuning.`,
      timeline: 'Months 1-6: Literature Review & Setup; Months 7-12: Implementation; Months 13-18: Testing & Evaluation; Months 19-24: Thesis Writing & Final Presentation.',
      expectedResults: `It is expected that this research will achieve ${inputs.expectedOutcome}, leading to a significant increase in efficiency, accuracy, and robust system configurations.`,
      clarityScore: 85,
      originalityScore: 80,
      feasibilityScore: 78,
      grammarScore: 92,
      feedbackRemarks: 'Your proposal outlines a strong problem statement. To improve, add details on specific datasets you plan to utilize in Japan, and cite recent publications from the professors you wish to contact.',
    };
  }

  private getMockEmail(inputs: any) {
    const prof = inputs.professorName || 'Professor Tanaka';
    const univ = inputs.university || 'The University of Tokyo';
    const interest = inputs.researchInterest || 'Artificial Intelligence';
    return {
      emailBody: `Subject: Inquiry Regarding Master's Research Supervision - MEXT Scholarship Candidate

Dear ${prof},

I hope this email finds you well.

My name is ${inputs.studentName}, a graduate in ${inputs.background || 'Computer Science'}. I am currently preparing my application for the MEXT Embassy Scholarship to pursue graduate studies in Japan.

I have read your lab's publications on ${interest} with great interest, particularly your recent paper on system optimization. My proposed research focuses on applying machine learning to enhance throughput, which aligns closely with your lab's focus.

Attached are my academic transcripts, resume, and research proposal draft. I would be deeply honored if you would consider supervising my research should I succeed in the MEXT preliminary screening.

Thank you very much for your time and consideration.

Sincerely,
${inputs.studentName}`,
    };
  }

  private getMockSopAnalysis() {
    return {
      score: 82,
      grammarFeedback: 'Grammar is excellent. Active voice is maintained throughout. Make sure to double-check spelling of Japanese university names.',
      structureFeedback: 'Paragraph flow is solid. The transition between your undergraduate projects and your interest in Japan could be made smoother.',
      alignmentFeedback: 'Your research matches perfectly with current Japanese laboratory paradigms, specifically in computational fields.',
      toneFeedback: 'Tone is highly professional and academic. Avoid using overly informal words.',
      suggestions: [
        'Connect your career goal explicitly to Japan-East Asia relations or industrial collaboration.',
        'Clarify the specific lab techniques you hope to acquire in Japan.',
      ],
    };
  }

  private getMockResumeAnalysis() {
    return {
      score: 75,
      skillsIdentified: ['Python', 'Docker', 'Machine Learning', 'Git', 'Data Structures'],
      missingSkills: ['Kubernetes', 'Cloud Computing (AWS/GCP)', 'CI/CD Pipelines'],
      suggestions: [
        'Add a dedicated section summarizing your academic publication or undergraduate thesis.',
        'Highlight open-source contributions or research labs you worked in.',
      ],
    };
  }
}
