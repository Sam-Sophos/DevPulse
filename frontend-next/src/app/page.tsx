import BackendStatus from '@/components/BackendStatus';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <BackendStatus />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Track your
            <span className="block text-blue-600">developer pulse</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            DevPulse helps developers track coding sessions, focus time, and daily logs.
            Gain insights and visualize your productivity over time.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700">
              Start logging now
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
              View demo
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-100 p-3">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Time Tracking</h3>
              <p className="mt-2 text-gray-600">
                Automatically track coding sessions and focus time across all your projects.
              </p>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-100 p-3">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Dev Logs</h3>
              <p className="mt-2 text-gray-600">
                Quick daily logs to capture insights, blockers, and achievements.
              </p>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-100 p-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Insights & Analytics</h3>
              <p className="mt-2 text-gray-600">
                Visualize your progress, identify patterns, and optimize your workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-20 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
          <p className="mt-2 text-gray-600">
            Verify that your development environment is properly configured.
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <h4 className="font-medium text-gray-900">Backend API Connection</h4>
                <p className="text-sm text-gray-600">Connected to http://localhost:5000</p>
              </div>
              <BackendStatus />
            </div>
            
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">How it works</h4>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>The frontend proxies API requests to the backend server running on port 5000.</p>
                    <p className="mt-1">If you see "Backend healthy", your development environment is working correctly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
