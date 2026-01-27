export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  project: string;
  tags: string[];
  notes?: string;
  isActive: boolean;
}

export interface SessionCreate {
  project: string;
  tags: string[];
  notes?: string;
}

export interface SessionUpdate {
  endTime?: string;
  notes?: string;
}

export interface DailyStats {
  date: string;
  totalSessions: number;
  totalFocusTime: number; // in minutes
  projects: string[];
  tags: string[];
}
