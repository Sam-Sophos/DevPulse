'use client';

import { useState } from 'react';

interface WeeklyReport {
  week: string;
  sessions: number;
  focusTime: number;
  avgSessionLength: number;
  consistency: number;
  productivityScore: number;
}

interface Insight {
  type: 'success' | 'warning' | 'improvement' | 'milestone';
  title: string;
  description: string;
}

export default function ProgressReports() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  
  const reports: WeeklyReport[] = [
    {
      week: 'Jan 26 - Feb 1',
      sessions: 18,
      focusTime: 1320,
      avgSessionLength: 73,
      consistency: 86,
      productivityScore: 78
    },
    {
      week: 'Feb 2 - Feb 8',
      sessions: 22,
      focusTime: 1540,
      avgSessionLength: 70,
      consistency: 100,
      productivityScore: 85
    },
    {
      week: 'Current Week',
      sessions: 8,
      focusTime: 480,
      avgSessionLength: 60,
      consistency: 100,
      productivityScore: 82
    }
  ];

  const insights: Insight[] = [
    {
      type: 'milestone',
      title: 'Consistency Champion!',
      description: 'You\'ve maintained 100% consistency for 2 weeks straight.'
    },
    {
      type: 'success',
      title: 'Focus Time Increased',
      description: 'Your weekly focus time increased by 17% compared to last month.'
    },
    {
      type: 'improvement',
      title: 'Session Optimization',
      description: 'Average session length decreased slightly. Consider if shorter sessions work better.'
    },
    {
      type: 'warning',
      title: 'Evening Productivity Dip',
      description: 'Your most productive hours are 9 AM - 12 PM.'
    }
  ];

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'success': return 'border-emerald-500/30 bg-emerald-500/10';
      case 'warning': return 'border-amber-500/30 bg-amber-500/10';
      case 'improvement': return 'border-cyan-500/30 bg-cyan-500/10';
      case 'milestone': return 'border-purple-500/30 bg-purple-500/10';
    }
  };

  const currentReport = reports[reports.length - 1];

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Progress Reports</h2>
            <p className="text-gray-400">Weekly insights and productivity analysis</p>
          </div>
          
          <div className="flex space-x-2">
            {(['week', 'month', 'quarter'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  timeRange === range
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Week Summary */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">This Week's Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Productivity Score</div>
            <div className={`text-3xl font-bold ${getProductivityColor(currentReport.productivityScore)}`}>
              {currentReport.productivityScore}/100
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Focus Time</div>
            <div className="text-3xl font-bold text-emerald-300">
              {formatHours(currentReport.focusTime)}
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Sessions</div>
            <div className="text-3xl font-bold text-cyan-300">
              {currentReport.sessions}
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Consistency</div>
            <div className="text-3xl font-bold text-purple-300">
              {currentReport.consistency}%
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Personalized Insights</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">
                  {insight.type === 'success' && '✅'}
                  {insight.type === 'warning' && '⚠️'}
                  {insight.type === 'improvement' && '💡'}
                  {insight.type === 'milestone' && '🏆'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-300">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Data */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Trends</h3>
        
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium text-white">{report.week}</div>
                <div className={`px-3 py-1 rounded-full text-sm ${getProductivityColor(report.productivityScore)}`}>
                  Score: {report.productivityScore}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-cyan-300">{report.sessions}</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-300">{formatHours(report.focusTime)}</div>
                  <div className="text-xs text-gray-400">Focus Time</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-300">{report.consistency}%</div>
                  <div className="text-xs text-gray-400">Consistency</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
