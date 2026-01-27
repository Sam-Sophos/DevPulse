'use client';

import { useState, useEffect } from 'react';

interface SessionTimerProps {
  onStartSession: () => Promise<void>;
  onEndSession: (duration: number) => Promise<void>;
  isActive: boolean;
}

export default function SessionTimer({ onStartSession, onEndSession, isActive }: SessionTimerProps) {
  const [time, setTime] = useState(0); // in seconds
  const [project, setProject] = useState('DevPulse Development');
  const [tags, setTags] = useState(['coding', 'portfolio']);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      await onStartSession();
      setTime(0);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleStop = async () => {
    try {
      const minutes = Math.round(time / 60);
      await onEndSession(minutes);
      setTime(0);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Focus Session</h2>
      
      <div className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-5xl font-mono font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {formatTime(time)}
          </div>
          <div className="text-gray-400 text-sm">
            {isActive ? 'Session in progress...' : 'Ready to start'}
          </div>
        </div>

        {/* Project Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project
          </label>
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="What are you working on?"
          />
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="coding, portfolio, nextjs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Focus Session
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              End Session
            </button>
          )}
        </div>

        {/* Session Stats */}
        <div className="pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-300">
                {Math.round(time / 60)}
              </div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">
                {Math.round((time / 60) * 0.5)}
              </div>
              <div className="text-xs text-gray-400">Pomodoros</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-300">
                {Math.round((time / 3600) * 100) / 100}
              </div>
              <div className="text-xs text-gray-400">Hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
