'use client';

import { useState, useEffect } from 'react';
import HealthStatus from '@/components/HealthStatus';
import SessionTimer from '@/components/SessionTimer';
import DevLogForm from '@/components/DevLogForm';
import StatisticsDashboard from '@/components/StatisticsDashboard';

interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  project: string;
  tags: string[];
  notes?: string;
  isActive: boolean;
}

interface DailyStats {
  totalSessions: number;
  completedSessions: number;
  activeSessions: number;
  totalFocusTime: number;
  averageSessionLength: number;
}

export default function Home() {
  const [activeSession, setActiveSession] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<DailyStats>({
    totalSessions: 0,
    completedSessions: 0,
    activeSessions: 0,
    totalFocusTime: 0,
    averageSessionLength: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodaySessions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions/today');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSessions(data.data.sessions);
          setStats(data.data.stats);
          setActiveSession(data.data.stats.activeSessions > 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: 'DevPulse Development',
          tags: ['coding', 'portfolio'],
          notes: 'Working on DevPulse project'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActiveSession(true);
          await fetchTodaySessions();
        }
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (duration: number) => {
    setIsLoading(true);
    try {
      const activeSession = sessions.find(s => s.isActive);
      if (!activeSession) {
        console.error('No active session found');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/sessions/${activeSession.id}/end`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActiveSession(false);
          await fetchTodaySessions();
        }
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDevLog = async (logData: { content: string; tags: string[]; mood: number }) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/devlogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Dev log saved successfully!');
          return Promise.resolve();
        }
      }
      return Promise.reject('Failed to save log');
    } catch (error) {
      console.error('Failed to save dev log:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaySessions();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  DevPulse
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Developer productivity and reflection platform
              </p>
            </div>
            <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2">
              <div className="font-mono">{new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}</div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-300">{stats.totalSessions}</div>
            <div className="text-xs text-gray-400">Sessions</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-300">{stats.totalFocusTime}m</div>
            <div className="text-xs text-gray-400">Focus Time</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">{stats.completedSessions}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-300">{stats.activeSessions}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-300">{stats.averageSessionLength}m</div>
            <div className="text-xs text-gray-400">Avg. Session</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Session Timer */}
            <SessionTimer
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              isActive={activeSession}
            />

            {/* Statistics Dashboard */}
            <StatisticsDashboard />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Dev Log Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-green-300">Daily Reflection</h2>
              <DevLogForm
                onSubmit={handleSaveDevLog}
                isLoading={isLoading}
              />
            </div>

            {/* System Status */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-white">System Status</h2>
              <HealthStatus />
            </div>
          </div>
        </div>

        <footer className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>DevP
# Update homepage to include statistics
cd ..
cat > app/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import HealthStatus from '@/components/HealthStatus';
import SessionTimer from '@/components/SessionTimer';
import DevLogForm from '@/components/DevLogForm';
import StatisticsDashboard from '@/components/StatisticsDashboard';

interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  project: string;
  tags: string[];
  notes?: string;
  isActive: boolean;
}

interface DailyStats {
  totalSessions: number;
  completedSessions: number;
  activeSessions: number;
  totalFocusTime: number;
  averageSessionLength: number;
}

export default function Home() {
  const [activeSession, setActiveSession] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<DailyStats>({
    totalSessions: 0,
    completedSessions: 0,
    activeSessions: 0,
    totalFocusTime: 0,
    averageSessionLength: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodaySessions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions/today');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSessions(data.data.sessions);
          setStats(data.data.stats);
          setActiveSession(data.data.stats.activeSessions > 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: 'DevPulse Development',
          tags: ['coding', 'portfolio'],
          notes: 'Working on DevPulse project'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActiveSession(true);
          await fetchTodaySessions();
        }
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (duration: number) => {
    setIsLoading(true);
    try {
      const activeSession = sessions.find(s => s.isActive);
      if (!activeSession) {
        console.error('No active session found');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/sessions/${activeSession.id}/end`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActiveSession(false);
          await fetchTodaySessions();
        }
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDevLog = async (logData: { content: string; tags: string[]; mood: number }) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/devlogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Dev log saved successfully!');
          return Promise.resolve();
        }
      }
      return Promise.reject('Failed to save log');
    } catch (error) {
      console.error('Failed to save dev log:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaySessions();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  DevPulse
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Developer productivity and reflection platform
              </p>
            </div>
            <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2">
              <div className="font-mono">{new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}</div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-300">{stats.totalSessions}</div>
            <div className="text-xs text-gray-400">Sessions</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-300">{stats.totalFocusTime}m</div>
            <div className="text-xs text-gray-400">Focus Time</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">{stats.completedSessions}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-300">{stats.activeSessions}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-300">{stats.averageSessionLength}m</div>
            <div className="text-xs text-gray-400">Avg. Session</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Session Timer */}
            <SessionTimer
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              isActive={activeSession}
            />

            {/* Statistics Dashboard */}
            <StatisticsDashboard />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Dev Log Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-green-300">Daily Reflection</h2>
              <DevLogForm
                onSubmit={handleSaveDevLog}
                isLoading={isLoading}
              />
            </div>

            {/* System Status */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-white">System Status</h2>
              <HealthStatus />
            </div>
          </div>
        </div>

        <footer className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>DevPulse v1.4.0 • Building in public • One commit per day</p>
          <p className="text-sm mt-2">Statistics Dashboard • Jan 30, 2026</p>
        </footer>
      </div>
    </main>
  );
}
