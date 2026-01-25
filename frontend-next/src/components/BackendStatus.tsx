'use client';

import { useState, useEffect } from 'react';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
}

export default function BackendStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data: HealthResponse = await response.json();
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
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700">Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <span className="text-sm font-medium text-red-700">Backend offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100">
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
      <span className="text-sm font-medium text-green-700">Backend healthy</span>
      <span className="text-xs text-green-600">
        {Math.floor((health?.uptime || 0) / 60)}m uptime
      </span>
    </div>
  );
}
