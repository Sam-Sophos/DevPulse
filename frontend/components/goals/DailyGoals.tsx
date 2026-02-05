'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  color: string;
}

export default function DailyGoals() {
  const { showSuccess } = useNotifications();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'focus-time',
      title: 'Focus Time',
      target: 120,
      current: 75,
      unit: 'minutes',
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    },
    {
      id: 'sessions',
      title: 'Coding Sessions',
      target: 4,
      current: 2,
      unit: 'sessions',
      color: 'bg-gradient-to-r from-emerald-500 to-green-500'
    },
    {
      id: 'dev-logs',
      title: 'Dev Logs',
      target: 1,
      current: 1,
      unit: 'entries',
      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    {
      id: 'pomodoros',
      title: 'Pomodoros',
      target: 8,
      current: 4,
      unit: 'cycles',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ]);

  const calculateProgress = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + increment, goal.target);
        if (newCurrent === goal.target) {
          showSuccess(`🎉 Goal achieved: ${goal.title}!`);
        }
        return { ...goal, current: newCurrent };
      }
      return goal;
    }));
  };

  const resetGoals = () => {
    setGoals(prev => prev.map(goal => ({ ...goal, current: 0 })));
    showSuccess('Daily goals reset. Start fresh!');
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Daily Goals</h2>
        <button
          onClick={resetGoals}
          className="text-sm text-gray-400 hover:text-gray-300"
        >
          Reset
        </button>
      </div>
      
      <div className="space-y-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium text-white">{goal.title}</div>
                <div className="text-sm text-gray-300">
                  {goal.current}/{goal.target} {goal.unit}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${goal.color} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>{progress.toFixed(0)}% complete</span>
                <div className="space-x-2">
                  <button
                    onClick={() => updateGoalProgress(goal.id, 1)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 5)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">
              {goals.filter(g => g.current >= g.target).length}/{goals.length}
            </div>
            <div className="text-xs text-gray-400">Goals Achieved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-300">
              {Math.round(goals.reduce((acc, goal) => acc + calculateProgress(goal), 0) / goals.length)}%
            </div>
            <div className="text-xs text-gray-400">Overall Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}
