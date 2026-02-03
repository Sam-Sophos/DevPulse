'use client';

import { useState, useEffect } from 'react';

interface SessionDay {
  date: string;
  sessions: number;
  focusTime: number;
  mood?: number;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  sessions?: number;
  focusTime?: number;
  mood?: number;
}

export default function SessionCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionDay[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Generate mock data
  useEffect(() => {
    const mockData: SessionDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const sessions = Math.floor(Math.random() * 7);
      const focusTime = sessions > 0 ? Math.floor(Math.random() * 480) + 30 : 0;
      const mood = sessions > 0 ? Math.floor(Math.random() * 5) + 1 : undefined;
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        sessions,
        focusTime,
        mood
      });
    }
    
    setSessionHistory(mockData);
  }, []);

  // Generate calendar days
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days: CalendarDay[] = [];
    const currentDateIter = new Date(startDate);
    
    while (currentDateIter <= endDate) {
      const dateStr = currentDateIter.toISOString().split('T')[0];
      const sessionData = sessionHistory.find(day => day.date === dateStr);
      const isCurrentMonth = currentDateIter.getMonth() === month;
      const isToday = currentDateIter.toDateString() === today.toDateString();
      
      days.push({
        date: new Date(currentDateIter),
        isCurrentMonth,
        isToday,
        sessions: sessionData?.sessions || 0,
        focusTime: sessionData?.focusTime || 0,
        mood: sessionData?.mood
      });
      
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    setCalendarDays(days);
  }, [currentDate, sessionHistory]);

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const getMoodEmoji = (mood?: number) => {
    if (!mood) return null;
    const emojis = ['😞', '😕', '😐', '🙂', '😄'];
    return emojis[mood - 1];
  };

  const getFocusLevel = (focusTime: number) => {
    if (focusTime === 0) return 'none';
    if (focusTime < 60) return 'low';
    if (focusTime < 180) return 'medium';
    if (focusTime < 360) return 'high';
    return 'very-high';
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getSelectedDayDetails = () => {
    if (!selectedDate) return null;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const sessionData = sessionHistory.find(day => day.date === dateStr);
    
    if (!sessionData || sessionData.sessions === 0) {
      return {
        date: selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
        sessions: 0,
        focusTime: 0,
        mood: undefined
      };
    }
    
    return {
      date: selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      sessions: sessionData.sessions,
      focusTime: sessionData.focusTime,
      mood: sessionData.mood
    };
  };

  const selectedDetails = getSelectedDayDetails();

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Session Calendar</h2>
            <p className="text-gray-400">Visualize your productivity over time</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Week
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={navigatePrevious}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={navigateToday}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Today
              </button>
              <button
                onClick={navigateNext}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-xl font-bold text-white">
            {formatMonthYear()}
          </h3>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const focusLevel = getFocusLevel(day.focusTime || 0);
            const focusColors = {
              'none': 'bg-gray-800/30',
              'low': 'bg-emerald-900/30',
              'medium': 'bg-emerald-800/40',
              'high': 'bg-emerald-700/50',
              'very-high': 'bg-emerald-600/60'
            };
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  aspect-square rounded-lg p-2 flex flex-col items-center justify-center
                  transition-all hover:scale-105 hover:bg-gray-700/30
                  ${!day.isCurrentMonth ? 'opacity-40' : ''}
                  ${day.isToday ? 'ring-2 ring-cyan-500' : ''}
                  ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-cyan-600/20 ring-2 ring-cyan-400' : ''}
                  ${focusColors[focusLevel]}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !day.isCurrentMonth ? 'text-gray-500' :
                  day.isToday ? 'text-cyan-300' :
                  'text-gray-300'
                }`}>
                  {day.date.getDate()}
                </div>
                
                {day.sessions && day.sessions > 0 && (
                  <>
                    <div className="text-xs font-bold text-white mb-1">
                      {day.sessions} session{day.sessions !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-emerald-300">
                      {Math.floor((day.focusTime || 0) / 60)}h {(day.focusTime || 0) % 60}m
                    </div>
                    {day.mood && (
                      <div className="text-lg mt-1">
                        {getMoodEmoji(day.mood)}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDetails && (
          <div className="mt-8 bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {selectedDetails.date}
            </h3>
            
            {selectedDetails.sessions === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📅</div>
                <h4 className="text-xl font-semibold text-white mb-2">No sessions recorded</h4>
                <p className="text-gray-400">This was a rest day or day off</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-lg p-5">
                  <div className="text-3xl font-bold text-cyan-300 mb-2">{selectedDetails.sessions}</div>
                  <div className="text-sm text-gray-400">Sessions</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-5">
                  <div className="text-3xl font-bold text-emerald-300 mb-2">
                    {Math.floor(selectedDetails.focusTime / 60)}h {selectedDetails.focusTime % 60}m
                  </div>
                  <div className="text-sm text-gray-400">Focus Time</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-5">
                  <div className="text-3xl font-bold text-amber-300 mb-2">
                    {selectedDetails.mood ? getMoodEmoji(selectedDetails.mood) : '😐'}
                  </div>
                  <div className="text-sm text-gray-400">Average Mood</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
