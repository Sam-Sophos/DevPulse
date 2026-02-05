'use client';

import { useState, useEffect } from 'react';
import HealthStatus from '@/components/HealthStatus';
import SessionTimer from '@/components/SessionTimer';
import DevLogForm from '@/components/DevLogForm';
import StatisticsDashboard from '@/components/StatisticsDashboard';
import DataManager from '@/components/DataManager';
import Achievements from '@/components/achievements/Achievements';
import PomodoroTimer from '@/components/timer/PomodoroTimer';
import SessionCalendar from '@/components/calendar/SessionCalendar';
import QuickActions from '@/components/quick-actions/QuickActions';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { useNotifications } from '@/hooks/useNotifications';

export default function Home() {
  const [activeSession, setActiveSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const { showSuccess, showError, showLoading, dismiss } = useNotifications();

  const handleStartSession = async () => {
    const loadingToast = showLoading('Starting session...');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveSession(true);
      dismiss(loadingToast);
      showSuccess('Session started successfully!');
    } catch (error) {
      dismiss(loadingToast);
      showError('Failed to start session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (duration: number) => {
    const loadingToast = showLoading('Ending session...');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveSession(false);
      dismiss(loadingToast);
      showSuccess(`Session ended after ${duration} minutes`);
    } catch (error) {
      dismiss(loadingToast);
      showError('Failed to end session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDevLog = async (logData: { content: string; tags: string[]; mood: number }) => {
    const loadingToast = showLoading('Saving dev log...');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      dismiss(loadingToast);
      showSuccess('Dev log saved successfully!');
      return Promise.resolve();
    } catch (error) {
      dismiss(loadingToast);
      showError('Failed to save dev log');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewButtons = [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'pomodoro', label: 'Pomodoro', emoji: '🍅' },
    { id: 'calendar', label: 'Calendar', emoji: '📅' },
    { id: 'data', label: 'Data', emoji: '💾' },
    { id: 'achievements', label: 'Achievements', emoji: '🏆' },
  ];

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 md:mb-12 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
                <div className="font-mono">Feb 5, 2026</div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex flex-wrap gap-2 mb-6">
              {viewButtons.map(({ id, label, emoji }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id)}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                    activeView === id
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-gray-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-300">12</div>
                <div className="text-xs text-gray-400">Sessions</div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-300">480m</div>
                <div className="text-xs text-gray-400">Focus Time</div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-300">8</div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-300">1</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-300">45m</div>
                <div className="text-xs text-gray-400">Avg. Session</div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          {activeView === 'dashboard' && (
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Actions */}
                <QuickActions />

                {/* Session Timer */}
                <SessionTimer
                  onStartSession={handleStartSession}
                  onEndSession={handleEndSession}
                  isActive={activeSession}
                  isLoading={isLoading}
                />

                {/* Statistics Dashboard */}
                <StatisticsDashboard />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Dev Log Form */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover-lift">
                  <h2 className="text-2xl font-semibold mb-6 text-green-300">Daily Reflection</h2>
                  <DevLogForm
                    onSubmit={handleSaveDevLog}
                    isLoading={isLoading}
                  />
                </div>

                {/* System Status */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover-lift">
                  <h2 className="text-2xl font-semibold mb-6 text-white">System Status</h2>
                  <HealthStatus />
                </div>
              </div>
            </div>
          )}

          {activeView === 'pomodoro' && (
            <div className="mb-8">
              <PomodoroTimer />
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="mb-8">
              <SessionCalendar />
            </div>
          )}

          {activeView === 'data' && (
            <div className="mb-8">
              <DataManager />
            </div>
          )}

          {activeView === 'achievements' && (
            <div className="mb-8">
              <Achievements />
            </div>
          )}

          <footer className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>DevPulse v2.4.0 • Building in public • One commit per day</p>
            <p className="text-sm mt-2">Quick Actions & Dashboard Improvements • Feb 5, 2026</p>
          </footer>
        </div>
      </main>
    </ErrorBoundary>
  );
}
