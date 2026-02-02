'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'session' | 'time' | 'streak' | 'productivity';
  xp: number;
}

const ACHIEVEMENTS: Achievement[] = [
  // Session achievements
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your first coding session',
    icon: '🚀',
    progress: 0,
    total: 1,
    unlocked: false,
    category: 'session',
    xp: 10
  },
  {
    id: 'marathon',
    title: 'Marathon Runner',
    description: 'Complete 10 sessions',
    icon: '🏃',
    progress: 0,
    total: 10,
    unlocked: false,
    category: 'session',
    xp: 50
  },
  {
    id: 'session_master',
    title: 'Session Master',
    description: 'Complete 50 sessions',
    icon: '👑',
    progress: 0,
    total: 50,
    unlocked: false,
    category: 'session',
    xp: 100
  },

  // Time achievements
  {
    id: 'first_hour',
    title: 'Hour of Power',
    description: 'Log 1 hour of focused time',
    icon: '⏰',
    progress: 0,
    total: 60,
    unlocked: false,
    category: 'time',
    xp: 20
  },
  {
    id: 'productive_day',
    title: 'Productive Day',
    description: 'Log 4 hours in a single day',
    icon: '☀️',
    progress: 0,
    total: 240,
    unlocked: false,
    category: 'time',
    xp: 50
  },
  {
    id: 'time_titan',
    title: 'Time Titan',
    description: 'Log 100 hours total',
    icon: '💪',
    progress: 0,
    total: 6000,
    unlocked: false,
    category: 'time',
    xp: 200
  },

  // Streak achievements
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day coding streak',
    icon: '🔥',
    progress: 0,
    total: 7,
    unlocked: false,
    category: 'streak',
    xp: 75
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Maintain a 30-day coding streak',
    icon: '📅',
    progress: 0,
    total: 30,
    unlocked: false,
    category: 'streak',
    xp: 150
  },

  // Productivity achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Start a session before 8 AM',
    icon: '🌅',
    progress: 0,
    total: 1,
    unlocked: false,
    category: 'productivity',
    xp: 25
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Code on both Saturday and Sunday',
    icon: '🎯',
    progress: 0,
    total: 2,
    unlocked: false,
    category: 'productivity',
    xp: 40
  },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showUnlocked, setShowUnlocked] = useState<string[]>([]);
  const { showSuccess } = useNotifications();

  // Simulate loading achievements from API
  useEffect(() => {
    // In a real app, this would come from an API
    const mockData = ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      progress: Math.min(Math.floor(Math.random() * achievement.total * 1.5), achievement.total),
      unlocked: Math.random() > 0.7
    }));

    setAchievements(mockData);
    
    // Calculate total XP from unlocked achievements
    const unlocked = mockData.filter(a => a.unlocked);
    const xp = unlocked.reduce((sum, a) => sum + a.xp, 0);
    setTotalXP(xp);
    setLevel(Math.floor(xp / 100) + 1);
  }, []);

  const categories = ['all', 'session', 'time', 'streak', 'productivity'];

  const filteredAchievements = activeCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === activeCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const handleUnlock = (id: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
    ));
    setShowUnlocked(prev => [...prev, id]);
    
    const achievement = achievements.find(a => a.id === id);
    if (achievement) {
      setTotalXP(prev => {
        const newXP = prev + achievement.xp;
        setLevel(Math.floor(newXP / 100) + 1);
        return newXP;
      });
      
      showSuccess(`Achievement unlocked: ${achievement.title} (+${achievement.xp} XP)`);
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
            <p className="text-gray-400">Earn XP and level up by tracking your progress</p>
          </div>
          
          {/* XP & Level */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">Lvl {level}</div>
              <div className="text-xs text-gray-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-300">{totalXP}</div>
              <div className="text-xs text-gray-400">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300">{unlockedCount}/{totalCount}</div>
              <div className="text-xs text-gray-400">Unlocked</div>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex space-x-2 mt-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="p-6">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">No achievements found</h3>
            <p className="text-gray-400">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-xl p-5 border-2 transition-all hover-lift ${
                  achievement.unlocked
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-gray-700 bg-gray-800/50'
                } ${showUnlocked.includes(achievement.id) ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">{achievement.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                      </div>
                      <div className="text-sm font-bold text-amber-300">+{achievement.xp} XP</div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            achievement.unlocked ? 'bg-emerald-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        {achievement.unlocked ? (
                          <span className="text-emerald-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-amber-400">In progress</span>
                        )}
                      </div>
                      
                      {!achievement.unlocked && (
                        <button
                          onClick={() => handleUnlock(achievement.id)}
                          className="text-xs px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
                        >
                          Simulate Unlock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-6 bg-gray-900/50">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div>
            <span className="text-emerald-400 font-medium">{unlockedCount} unlocked</span>
            <span className="mx-2">•</span>
            <span>{totalCount - unlockedCount} remaining</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Progress to next level:</span>
            <span className="font-bold text-cyan-300">{totalXP % 100}/100 XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
