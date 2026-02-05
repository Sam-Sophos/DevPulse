'use client';

import { useNotifications } from '@/hooks/useNotifications';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

export default function QuickActions() {
  const { showSuccess } = useNotifications();

  const actions: QuickAction[] = [
    {
      id: 'quick-session',
      label: 'Quick Session',
      description: 'Start a 25-min focused session',
      icon: '⚡',
      color: 'from-cyan-500 to-blue-500',
      action: () => {
        showSuccess('Quick session started! Focus for 25 minutes.');
      }
    },
    {
      id: 'break',
      label: 'Take Break',
      description: 'Start a 5-min break timer',
      icon: '☕',
      color: 'from-emerald-500 to-green-500',
      action: () => {
        showSuccess('Break timer started. Relax for 5 minutes!');
      }
    },
    {
      id: 'log-entry',
      label: 'Quick Log',
      description: 'Jot down a quick note',
      icon: '📝',
      color: 'from-amber-500 to-orange-500',
      action: () => {
        showSuccess('Quick log saved!');
      }
    },
    {
      id: 'stats',
      label: 'View Stats',
      description: 'See today\'s statistics',
      icon: '📊',
      color: 'from-purple-500 to-pink-500',
      action: () => {
        showSuccess('Opening statistics...');
      }
    }
  ];

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="bg-gray-800/50 hover:bg-gray-800/70 rounded-xl p-5 text-center transition-all hover:scale-105 group"
          >
            <div className={`text-3xl mb-3 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>
              {action.icon}
            </div>
            <div className="font-semibold text-white mb-1">{action.label}</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">
              {action.description}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-400 text-center">
          Use these shortcuts for common tasks. Each action provides instant feedback.
        </p>
      </div>
    </div>
  );
}
