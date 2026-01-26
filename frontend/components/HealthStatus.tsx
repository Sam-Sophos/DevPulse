'use client';

import { useEffect, useState } from 'react';

interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (!response.ok) throw new Error('API not responding');
      const data = await response.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : health ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-lg font-medium">Backend API Status</span>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors"
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {loading && <div className="text-gray-400">Connecting to backend...</div>}
      
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="font-medium text-red-300">Error: {error}</div>
          <div className="text-sm text-red-400 mt-1">Start backend with: cd backend && npm run dev</div>
        </div>
      )}
      
      {health && (
        <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Status</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <span className="font-medium text-green-300">{health.status}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Service</div>
              <div className="font-medium">{health.service}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Version</div>
              <div className="font-mono">{health.version}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Last Check</div>
              <div className="font-mono text-sm">{new Date(health.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
