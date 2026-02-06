import React, { useMemo } from 'react';
import { User, Activity, DevLog } from '../types';
import { ActivityChart } from '../components/ActivityChart';
import { Flame, Target, Trophy, GitCommit } from 'lucide-react';
import { calculateStreak } from '../services/storage';

interface DashboardProps {
  user: User;
  logs: DevLog[];
}

// Generate mock activity data for the chart
const generateMockActivity = (): Activity[] => {
  const data: Activity[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: Math.floor(Math.random() * 8),
    });
  }
  return data;
};

export const Dashboard: React.FC<DashboardProps> = ({ user, logs }) => {
  const activityData = useMemo(() => generateMockActivity(), []);
  const streak = calculateStreak(logs);
  
  // Calculate total logs
  const totalLogs = logs.length;
  
  // Determine mood based on recent logs
  const recentMood = logs.length > 0 ? logs[0].mood : 'neutral';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-foreground">Welcome back, {user.username}</h2>
        <p className="text-muted-foreground mt-1">Here's your growth overview for today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{streak} Days</h3>
                </div>
                <div className={`p-2 rounded-lg ${streak > 0 ? 'bg-orange-500/10 text-orange-500' : 'bg-muted text-muted-foreground'}`}>
                    <Flame size={20} />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Keep logging to maintain it!</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{totalLogs}</h3>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <BookOpenIcon size={20} />
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-4">Reflections recorded</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">2</h3>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                    <Target size={20} />
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-4">Making progress</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Recent Mood</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1 capitalize">{recentMood}</h3>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                    <Trophy size={20} />
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-4">Based on your last log</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-foreground">Activity (Commits + Logs)</h3>
             <select className="bg-muted text-xs px-2 py-1 rounded text-muted-foreground border-none outline-none">
                <option>Last 14 Days</option>
                <option>Last 30 Days</option>
             </select>
          </div>
          <ActivityChart data={activityData} />
        </div>

        {/* Recent Logs List */}
        <div className="bg-card border border-border p-6 rounded-xl">
           <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reflections</h3>
           <div className="space-y-4">
              {logs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">{log.date}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                              log.mood === 'great' ? 'bg-green-500/20 text-green-400' :
                              log.mood === 'bad' ? 'bg-red-500/20 text-red-400' : 
                              'bg-gray-500/20 text-gray-400'
                          }`}>{log.mood}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{log.learned}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">Worked on: {log.workedOn}</p>
                  </div>
              ))}
              {logs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                      No logs yet. Start today!
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper for icon
const BookOpenIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
