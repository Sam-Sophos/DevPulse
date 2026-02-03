'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  focusTime: number; // in minutes
  shortBreakTime: number;
  longBreakTime: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
}

export default function PomodoroTimer() {
  const { showSuccess, showInfo } = useNotifications();
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [settings, setSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: true,
    autoStartFocus: true,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    switch (mode) {
      case 'focus': return settings.focusTime * 60;
      case 'shortBreak': return settings.shortBreakTime * 60;
      case 'longBreak': return settings.longBreakTime * 60;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'focus': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'focus': return 'bg-gradient-to-r from-rose-600 to-pink-600';
      case 'shortBreak': return 'bg-gradient-to-r from-emerald-600 to-green-600';
      case 'longBreak': return 'bg-gradient-to-r from-blue-600 to-indigo-600';
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    showInfo(`${getModeLabel()} started!`);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    showInfo('Timer paused');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getTotalTime());
    showInfo('Timer reset');
  };

  const skipToNext = () => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      const nextSessionCount = completedSessions + 1;
      setCompletedSessions(nextSessionCount);
      
      if (nextSessionCount % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
        showSuccess('Great work! Time for a long break 🎉');
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
        showSuccess('Session complete! Take a short break ☕');
      }
    } else {
      setMode('focus');
      setTimeLeft(settings.focusTime * 60);
      showInfo('Break over! Ready to focus?');
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      const nextSessionCount = completedSessions + 1;
      setCompletedSessions(nextSessionCount);
      
      if (nextSessionCount % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
        showSuccess('🎉 Focus session complete! Time for a well-deserved long break.');
        
        if (settings.autoStartBreaks) {
          setTimeout(() => startTimer(), 1000);
        }
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
        showSuccess('✅ Focus session complete! Take a short break.');
        
        if (settings.autoStartBreaks) {
          setTimeout(() => startTimer(), 1000);
        }
      }
    } else {
      setMode('focus');
      setTimeLeft(settings.focusTime * 60);
      showInfo('Break complete! Ready for next focus session?');
      
      if (settings.autoStartFocus) {
        setTimeout(() => startTimer(), 1000);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    setTimeLeft(getTotalTime());
  }, [mode, settings]);

  const progress = ((getTotalTime() - timeLeft) / getTotalTime()) * 100;

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Pomodoro Timer</h2>
            <p className="text-gray-400">Stay focused, take breaks, repeat</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-gray-700 rounded-full text-sm">
              <span className="text-cyan-300 font-bold">{completedSessions}</span>
              <span className="text-gray-400 ml-1">sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timer */}
      <div className="p-8">
        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="rgba(75, 85, 99, 0.5)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-5xl font-mono font-bold mb-2 ${getModeColor()} bg-clip-text text-transparent`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg font-medium text-gray-300">{getModeLabel()}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round(progress)}% complete
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className={`px-8 py-3 ${getModeColor()} hover:opacity-90 rounded-xl font-medium transition-all duration-300 flex items-center`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start {mode === 'focus' ? 'Focus' : 'Break'}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90 rounded-xl font-medium transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </button>
            )}
            
            <button
              onClick={skipToNext}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Skip
            </button>
            
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((timerMode) => (
            <button
              key={timerMode}
              onClick={() => {
                setMode(timerMode);
                setIsRunning(false);
              }}
              className={`py-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                mode === timerMode
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">
                {timerMode === 'focus' && '🎯'}
                {timerMode === 'shortBreak' && '☕'}
                {timerMode === 'longBreak' && '🌴'}
              </div>
              <div className="font-medium capitalize">
                {timerMode === 'focus' && 'Focus'}
                {timerMode === 'shortBreak' && 'Short Break'}
                {timerMode === 'longBreak' && 'Long Break'}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {timerMode === 'focus' && `${settings.focusTime} min`}
                {timerMode === 'shortBreak' && `${settings.shortBreakTime} min`}
                {timerMode === 'longBreak' && `${settings.longBreakTime} min`}
              </div>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-rose-300">{completedSessions}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-300">
              {Math.floor((completedSessions * settings.focusTime) / 60)}h {(completedSessions * settings.focusTime) % 60}m
            </div>
            <div className="text-xs text-gray-400">Total Focus</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">
              {completedSessions > 0 ? Math.floor(completedSessions / settings.sessionsBeforeLongBreak) : 0}
            </div>
            <div className="text-xs text-gray-400">Long Breaks</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">
              {completedSessions % settings.sessionsBeforeLongBreak || 0}
            </div>
            <div className="text-xs text-gray-400">Next Long Break</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-6 bg-gray-900/50">
        <div className="text-sm text-gray-400">
          <div className="font-medium mb-2">ℹ️ Pomodoro Technique:</div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Focus for {settings.focusTime} minutes</li>
            <li>Take a {settings.shortBreakTime}-minute short break</li>
            <li>Every {settings.sessionsBeforeLongBreak} sessions, take a {settings.longBreakTime}-minute long break</li>
            <li>Repeat and stay productive! 🚀</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
