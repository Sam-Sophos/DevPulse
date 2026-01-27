export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  dailyGoal?: number; // minutes per day
  weeklyGoal?: number; // minutes per week
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultProject?: string;
  defaultTags?: string[];
}
