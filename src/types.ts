export interface PerformanceMetrics {
  throughput?: string;
  latency?: string;
  memoryEfficiency?: string;
  loadCapacity?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  deepDescription: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  metrics: PerformanceMetrics;
  codeSnippet: string;
  architectureDetails: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: 'contract' | 'full-time' | 'core-contributor';
  descriptionPoints: string[];
  gains: { label: string; value: string; isHot?: boolean }[];
}

export interface Skill {
  name: string;
  proficiency: number; // 0 to 100
  experienceYears: number;
  highlight: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}
