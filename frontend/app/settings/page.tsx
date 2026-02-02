'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultProject: string;
  defaultTags: string[];
  dailyGoal: number;
  weeklyGoal: number;
}

export default function SettingsPage() {
  const { showSuccess, showError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    notifications: true,
    defaultProject: 'DevPulse Development',
    defaultTags: ['coding', 'portfolio'],
    dailyGoal: 120,
    weeklyGoal: 600
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Settings saved successfully!');
    } catch (error) {
      showError('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      theme: 'dark',
      notifications: true,
      defaultProject: 'DevPulse Development',
      defaultTags: ['coding', 'portfolio'],
      dailyGoal: 120,
      weeklyGoal: 600
    });
    showSuccess('Settings reset to defaults');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your DevPulse experience</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings({...settings, theme})}
                    className={`py-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      settings.theme === theme
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full mb-2 ${
                      theme === 'light' ? 'bg-gray-300' :
                      theme === 'dark' ? 'bg-gray-800' :
                      'bg-gradient-to-r from-gray-300 to-gray-800'
                    }`} />
                    <span className="text-sm font-medium capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Session Reminders</div>
                <div className="text-sm text-gray-400">Get notified to take breaks</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Daily Summary</div>
                <div className="text-sm text-gray-400">Receive end-of-day reports</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Productivity Goals */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 md:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-6">Productivity Goals</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Daily Focus Goal (minutes)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="30"
                  max="480"
                  step="30"
                  value={settings.dailyGoal}
                  onChange={(e) => setSettings({...settings, dailyGoal: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">30m</span>
                  <span className="text-sm font-medium text-white">{settings.dailyGoal}m</span>
                  <span className="text-xs text-gray-400">8h</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weekly Focus Goal (minutes)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="120"
                  max="2400"
                  step="60"
                  value={settings.weeklyGoal}
                  onChange={(e) => setSettings({...settings, weeklyGoal: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">2h</span>
                  <span className="text-sm font-medium text-white">{Math.round(settings.weeklyGoal/60)}h</span>
                  <span className="text-xs text-gray-400">40h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Default Session Settings */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 md:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-6">Default Session Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Project
              </label>
              <input
                type="text"
                value={settings.defaultProject}
                onChange={(e) => setSettings({...settings, defaultProject: e.target.value})}
                className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter default project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Tags (comma separated)
              </label>
              <input
                type="text"
                value={settings.defaultTags.join(', ')}
                onChange={(e) => setSettings({...settings, defaultTags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
                className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="coding, portfolio, development"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-300 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
