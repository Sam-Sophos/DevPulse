import Link from 'next/link';
import BackendStatus from './BackendStatus';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600">
                <span className="text-sm font-bold text-white">DP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DevPulse</span>
            </Link>
            <div className="ml-10 hidden items-center space-x-8 md:flex">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/devlog" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Dev Log
              </Link>
              <Link href="/analytics" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Analytics
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <BackendStatus />
            <div className="hidden items-center space-x-3 md:flex">
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Sign in
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
