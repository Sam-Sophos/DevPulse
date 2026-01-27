'use client';

import { useState } from 'react';
import HealthStatus from '@/components/HealthStatus';
import SessionTimer from '@/components/SessionTimer';

export default function Home() {
  const [activeSession, setActiveSession] = useState(false);

  const handleStartSession = async () => {
    // TODO: Connect to backend API
    console.log('Starting session...');
    setActiveSession(true);
    return Promise.resolve();
  };

  const handleEndSession = async (duration: number) => {
    // TODO: Connect to backend API
    console.log(`Ending session after ${duration} minutes`);
    setActiveSession(false);
    return Promise.resolve();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DevPulse
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Developer productivity and reflection platform
          </p>
          <p className="text-gray-400">
            Track your coding sessions, log insights, and visualize your progress
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Session Timer Component */}
          <SessionTimer
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            isActive={activeSession}
          />

          {/* Quick Log */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">Daily Log</h2>
            <textarea
              className="w-full h-48 bg-gray-900/70 border border-gray-600 rounded-lg p-4 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
              placeholder="What did you work on today? Any breakthroughs, blockers, or insights?"
              rows={6}
            />
            <div className="flex space-x-3">
              <button className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-lg font-medium transition-all duration-300">
                Save Log
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                Clear
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="font-medium text-gray-300 mb-3">Today's Summary</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-cyan-300">0</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-300">0m</div>
                  <div className="text-xs text-gray-400">Focus Time</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-purple-300">0</div>
                  <div className="text-xs text-gray-400">Logs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-white">System Status</h2>
          <HealthStatus />
        </div>

        <footer className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>DevPulse v0.2.0 • Building in public • One commit per day</p>
          <p className="text-sm mt-2">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </footer>
      </div>
    </main>
  );
}
