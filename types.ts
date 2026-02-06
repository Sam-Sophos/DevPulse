export interface User {
  id: string;
  githubId?: string;
  username: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface DevLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  learned: string;
  workedOn: string;
  struggled: string;
  next: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
  aiFeedback?: string;
}

export enum ProjectStatus {
  IDEA = 'Idea',
  SETUP = 'Setup',
  IN_PROGRESS = 'In Progress',
  POLISHING = 'Polishing',
  SHIPPED = 'Shipped',
  PAUSED = 'Paused'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  lastActiveDate: string;
  status: ProjectStatus;
  technologies: string[];
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Language' | 'Framework' | 'Tool' | 'Soft Skill';
  growth: number; // monthly delta
}

export interface Activity {
  date: string;
  count: number;
}
