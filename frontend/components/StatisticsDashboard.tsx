'use client';

import { useState, useEffect } from 'react';

interface TimeStats {
  totalFocusTime: number;
  averageDailyTime: number;
  longestSession: number;
  currentStreak: number;
  bestStreak: number;
}

interface ProjectStats {
  project: string;
  totalSessions: number;
  totalTime: number;
  averageSessionLength: number;
}

interface DailyProgress {
  date: string;
  focusTime: number;
  sessions: number;
  goal: number;
  goalAchieved: boolean;
}

interface Insight {
  type: string;
  message: string;
  emoji: string;
  priority: 'high' | 'medium' | 'low';
}

export default function StatisticsDashboard() {
  const [timeStats, setTimeStats] = useState<TimeStats | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'progress'>('overview');

  const fetchStatistics = async () => {
    try {
      const [timeRes, projectsRes, progressRes, insightsRes] = await Promise.all([
        fetch('http://localhost:3001/api/stats/time'),
        fetch('http://localhost:3001/api/stats/projects'),
        fetch('http://localhost:3001/api/stats/daily-progress?days=7'),
        fetch('http://localhost:3001/api/stats/insights')
      ]);

      if (timeRes.ok) {
        const timeData = await timeRes.json();
        setTimeStats(timeData.data);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjectStats(projectsData.data);
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setDailyProgress(progressData.data);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData.data.insights || []);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', 'day': 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Productivity Dashboard</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'progress'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Progress
            </button>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`px-4 py-3 rounded-lg flex items-center space-x-3 ${
                  insight.priority === 'high'
                    ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30'
                    : insight.priority === 'medium'
                    ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30'
                    : 'bg-gray-700/50 border border-gray-600'
                }`}
              >
                <span className="text-2xl">{insight.emoji}</span>
                <span className="font-medium">{insight.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && timeStats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-2">Total Focus Time</div>
                <div className="text-3xl font-bold text-cyan-300">{formatMinutes(timeStats.totalFocusTime)}</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-2">Current Streak</div>
                <div className="text-3xl font-bold text-emerald-300">{timeStats.currentStreak} days</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-2">Daily Average</div>
                <div className="text-3xl font-bold text-purple-300">{formatMinutes(timeStats.averageDailyTime)}</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-2">Longest Session</div>
                <div className="text-3xl font-bold text-amber-300">{formatMinutes(timeStats.longestSession)}</div>
              </div>
            </div>

            {/* Project Highlights */}
            {projectStats.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Top Projects</h3>
                <div className="space-y-3">
                  {projectStats.slice(0, 3).map((project, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{project.project}</div>
                        <div className="text-cyan-300 font-bold">{formatMinutes(project.totalTime)}</div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{project.totalSessions} sessions</span>
                        <span>Avg: {formatMinutes(project.averageSessionLength)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && projectStats.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Project Breakdown</h3>
            <div className="space-y-4">
              {projectStats.map((project, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="font-medium text-lg">{project.project}</div>
                      <div className="text-sm text-gray-400">{project.totalSessions} sessions</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-300">{formatMinutes(project.totalTime)}</div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <div>Average session: {formatMinutes(project.averageSessionLength)}</div>
                    <div>Time per session: {formatMinutes(Math.round(project.totalTime / project.totalSessions))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && dailyProgress.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Last 7 Days</h3>
            <div className="space-y-4">
              {dailyProgress.map((day, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium">{formatDate(day.date)}</div>
                    <div className={`font-bold ${day.goalAchieved ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {formatMinutes(day.focusTime)} / {formatMinutes(day.goal)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{day.sessions} sessions</span>
                      <span>{Math.round((day.focusTime / day.goal) * 100)}% of goal</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${day.goalAchieved ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min((day.focusTime / day.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!timeStats || projectStats.length === 0) && !isLoading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Data Yet</h3>
            <p className="text-gray-400">Start tracking sessions to see your statistics here.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 px-6 py-4 bg-gray-900/50">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Updated just now</span>
          <button
            onClick={fetchStatistics}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
