'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export default function FocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { showSuccess } = useNotifications();

  const toggleFocusMode = () => {
    const newMode = !isFocusMode;
    setIsFocusMode(newMode);
    
    if (newMode) {
      document.body.classList.add('focus-mode');
      showSuccess('Focus mode activated! Distractions minimized.');
    } else {
      document.body.classList.remove('focus-mode');
      showSuccess('Focus mode deactivated.');
    }
  };

  return (
    <button
      onClick={toggleFocusMode}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
        isFocusMode
          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <span>{isFocusMode ? '🎯' : '🔍'}</span>
      <span>{isFocusMode ? 'Focus Mode ON' : 'Enter Focus Mode'}</span>
    </button>
  );
}
