'use client';

import { useState, useEffect } from 'react';

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  // Session shortcuts
  { key: 'Ctrl + Enter', description: 'Start new session', category: 'Session' },
  { key: 'Ctrl + Space', description: 'Pause/resume current session', category: 'Session' },
  { key: 'Ctrl + S', description: 'Save session', category: 'Session' },
  { key: 'Ctrl + E', description: 'End current session', category: 'Session' },
  
  // Navigation shortcuts
  { key: 'Ctrl + 1', description: 'Go to Dashboard', category: 'Navigation' },
  { key: 'Ctrl + 2', description: 'Go to Sessions', category: 'Navigation' },
  { key: 'Ctrl + 3', description: 'Go to Statistics', category: 'Navigation' },
  { key: 'Ctrl + 4', description: 'Go to Settings', category: 'Navigation' },
  
  // Editor shortcuts
  { key: 'Ctrl + B', description: 'Bold text in dev log', category: 'Editor' },
  { key: 'Ctrl + I', description: 'Italic text in dev log', category: 'Editor' },
  { key: 'Ctrl + K', description: 'Insert code block', category: 'Editor' },
  { key: 'Ctrl + L', description: 'Insert link', category: 'Editor' },
  
  // General shortcuts
  { key: 'Ctrl + /', description: 'Show this shortcuts dialog', category: 'General' },
  { key: 'Esc', description: 'Close modal/dialog', category: 'General' },
  { key: 'F5', description: 'Refresh page', category: 'General' },
  { key: 'Ctrl + R', description: 'Refresh page', category: 'General' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + / to toggle shortcuts
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredShortcuts = SHORTCUTS.filter(shortcut =>
    shortcut.key.toLowerCase().includes(search.toLowerCase()) ||
    shortcut.description.toLowerCase().includes(search.toLowerCase()) ||
    shortcut.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(SHORTCUTS.map(s => s.category)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                <p className="text-gray-400 mt-1">Speed up your workflow with these shortcuts</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="mt-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shortcuts..."
                className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No shortcuts found</h3>
                <p className="text-gray-400">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map(category => {
                  const categoryShortcuts = filteredShortcuts.filter(s => s.category === category);
                  if (categoryShortcuts.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                        {category}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {categoryShortcuts.map((shortcut, index) => (
                          <div
                            key={index}
                            className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-white">{shortcut.description}</div>
                              <kbd className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm font-mono text-cyan-300">
                                {shortcut.key}
                              </kbd>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-6 bg-gray-900/50">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs mr-2">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs ml-2">/</kbd>
                  <span className="ml-2">to toggle this dialog</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
