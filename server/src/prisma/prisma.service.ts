import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedIfNeeded();
  }

  private async seedIfNeeded() {
    try {
      const univCount = await this.university.count();
      if (univCount === 0) {
        console.log('Seeding universities...');
        const universitiesData = [
          {
            name: 'The University of Tokyo',
            field: 'Artificial Intelligence, Robotics, Physics, Quantum Computing',
            location: 'Tokyo',
            universityType: 'National',
            englishProgram: true,
            scholarships: 'MEXT, ADB-JSP, Todai Fellowship',
            website: 'https://www.u-tokyo.ac.jp/en/',
          },
          {
            name: 'Kyoto University',
            field: 'Machine Learning, Bioinformatics, Chemistry, Engineering',
            location: 'Kyoto',
            universityType: 'National',
            englishProgram: true,
            scholarships: 'MEXT, Kyoto University Foundation',
            website: 'https://www.kyoto-u.ac.jp/en/',
          },
          {
            name: 'Tokyo Institute of Technology',
            field: 'Computer Science, Nanotechnology, Materials Science, Aerospace',
            location: 'Tokyo',
            universityType: 'National',
            englishProgram: true,
            scholarships: 'MEXT, Tokyo Tech Fund',
            website: 'https://www.titech.ac.jp/english',
          },
          {
            name: 'Osaka University',
            field: 'Bioinformatics, Immunology, Systems Engineering, Data Science',
            location: 'Osaka',
            universityType: 'National',
            englishProgram: true,
            scholarships: 'MEXT, Osaka University Fellowship',
            website: 'https://www.osaka-u.ac.jp/en',
          },
          {
            name: 'Tohoku University',
            field: 'Aerospace Engineering, Materials Science, Disaster Science',
            location: 'Sendai',
            universityType: 'National',
            englishProgram: true,
            scholarships: 'MEXT, President Fellowship',
            website: 'https://www.tohoku.ac.jp/en/',
          },
          {
            name: 'Waseda University',
            field: 'Computer Science, Robotics, Economics, Public Policy',
            location: 'Tokyo',
            universityType: 'Private',
            englishProgram: true,
            scholarships: 'MEXT, Waseda University Scholarship',
            website: 'https://www.waseda.jp/top/en',
          },
          {
            name: 'Keio University',
            field: 'Quantum Computing, Cybersecurity, Bio-Simulation',
            location: 'Tokyo',
            universityType: 'Private',
            englishProgram: true,
            scholarships: 'MEXT, Keio Design Fund',
            website: 'https://www.keio.ac.jp/en/',
          },
        ];

        for (const data of universitiesData) {
          await this.university.create({ data });
        }
        console.log('Universities seeded successfully.');
      }

      const profCount = await this.professor.count();
      if (profCount === 0) {
        console.log('Seeding professors...');
        const professorsData = [
          {
            name: 'Prof. Kenji Tanaka',
            university: 'The University of Tokyo',
            researchArea: 'Robotics and Control Systems',
            keywords: 'robotics, control, path planning, automation, mechatronics',
            labUrl: 'https://example.edu/tanaka-lab',
            email: 'tanaka.kenji@u-tokyo.ac.jp',
          },
          {
            name: 'Prof. Hiroshi Yamamoto',
            university: 'Kyoto University',
            researchArea: 'Machine Learning and Computer Vision',
            keywords: 'machine learning, vision, deep learning, pattern recognition, neural networks',
            labUrl: 'https://example.edu/yamamoto-lab',
            email: 'yamamoto.h@kyoto-u.ac.jp',
          },
          {
            name: 'Prof. Yuki Sato',
            university: 'Tokyo Institute of Technology',
            researchArea: 'Materials Science and Nanotechnology',
            keywords: 'nanotechnology, materials, semiconductors, metallurgy, thin films',
            labUrl: 'https://example.edu/sato-lab',
            email: 'sato.y@titech.ac.jp',
          },
          {
            name: 'Prof. Masashi Takahashi',
            university: 'Osaka University',
            researchArea: 'Bioinformatics and Computational Biology',
            keywords: 'bioinformatics, genomics, dna sequencing, computational biology, genetics',
            labUrl: 'https://example.edu/takahashi-lab',
            email: 'm.takahashi@osaka-u.ac.jp',
          },
          {
            name: 'Prof. Akira Suzuki',
            university: 'Tohoku University',
            researchArea: 'Aerospace Engineering and Fluid Dynamics',
            keywords: 'aerospace, fluid dynamics, propulsion, aerodynamics, materials science',
            labUrl: 'https://example.edu/suzuki-lab',
            email: 'akira.suzuki@tohoku.ac.jp',
          },
          {
            name: 'Prof. Ryoko Kobayashi',
            university: 'Waseda University',
            researchArea: 'Quantum Computing and Cryptography',
            keywords: 'quantum computing, quantum information, physics, cybersecurity, algorithms',
            labUrl: 'https://example.edu/kobayashi-lab',
            email: 'ryoko.kobayashi@waseda.jp',
          },
        ];

        for (const data of professorsData) {
          await this.professor.create({ data });
        }
        console.log('Professors seeded successfully.');
      }
    } catch (err) {
      console.error('Failed to seed database:', err);
    }
  }
}
