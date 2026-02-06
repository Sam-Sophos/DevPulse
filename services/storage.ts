import { DevLog, Project } from '../types';
import { INITIAL_PROJECTS as DEFAULT_PROJECTS } from '../constants';

const LOGS_KEY = 'devpulse_logs';
const PROJECTS_KEY = 'devpulse_projects';

export const getLogs = (): DevLog[] => {
  const stored = localStorage.getItem(LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveLog = (log: DevLog): void => {
  const logs = getLogs();
  const index = logs.findIndex((l) => l.date === log.date);
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(PROJECTS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const calculateStreak = (logs: DevLog[]): number => {
  if (logs.length === 0) return 0;
  
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Check if there is a log for today or yesterday to keep streak alive
  const lastLogDate = sortedLogs[0].date;
  if (lastLogDate !== today && lastLogDate !== yesterday) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(lastLogDate);

  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date);
    
    // Normalize time to compare dates only
    logDate.setHours(0,0,0,0);
    currentDate.setHours(0,0,0,0);

    if (logDate.getTime() === currentDate.getTime()) {
      streak++;
      // Move expected date back by one day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
        // Gap detected
        break;
    }
  }
  return streak;
};