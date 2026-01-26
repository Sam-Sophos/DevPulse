import HealthStatus from '@/components/HealthStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DevPulse
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Developer productivity and reflection platform
          </p>
          <p className="text-gray-400">
            Track your coding sessions, log insights, and visualize your progress
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Today's Focus</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Coding Time</span>
                <span className="text-xl font-mono">0h 0m</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-medium transition-all duration-300">
                Start Session
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">Quick Log</h2>
            <textarea
              className="w-full h-32 bg-gray-900/70 border border-gray-600 rounded-lg p-4 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="What did you work on today? Any breakthroughs or blockers?"
            />
            <button className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-lg font-medium transition-all duration-300">
              Save Log
            </button>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-white">System Status</h2>
          <HealthStatus />
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>DevPulse v0.1.0 • Building in public • One commit per day</p>
        </footer>
      </div>
    </main>
  );
}
