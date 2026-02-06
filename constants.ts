import { Project, ProjectStatus, Skill, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  username: 'alex_dev',
  email: 'alex@example.com',
  avatarUrl: 'https://picsum.photos/200/200',
  joinedAt: '2023-01-15',
};

export const MOCK_SKILLS: Skill[] = [
  { name: 'TypeScript', level: 85, category: 'Language', growth: 5 },
  { name: 'React', level: 90, category: 'Framework', growth: 2 },
  { name: 'Node.js', level: 75, category: 'Framework', growth: 8 },
  { name: 'System Design', level: 60, category: 'Soft Skill', growth: 12 },
  { name: 'Python', level: 40, category: 'Language', growth: 0 },
  { name: 'PostgreSQL', level: 70, category: 'Tool', growth: 3 },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'DevPulse',
    description: 'A developer growth dashboard focused on authentic progress.',
    startDate: '2023-10-01',
    lastActiveDate: new Date().toISOString(),
    status: ProjectStatus.IN_PROGRESS,
    technologies: ['React', 'TypeScript', 'Tailwind'],
    milestones: [
      { id: 'm1', title: 'MVP Design', completed: true },
      { id: 'm2', title: 'GitHub Integration', completed: false },
      { id: 'm3', title: 'Beta Launch', completed: false },
    ],
  },
  {
    id: 'p2',
    name: 'WeatherCLI',
    description: 'Rust-based command line tool for weather.',
    startDate: '2023-08-15',
    lastActiveDate: '2023-09-10',
    status: ProjectStatus.PAUSED,
    technologies: ['Rust', 'Clap'],
    milestones: [
      { id: 'm1', title: 'Core Logic', completed: true },
    ],
  }
];
