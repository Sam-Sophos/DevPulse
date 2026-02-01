export default function StatisticsSkeleton() {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700 rounded-lg w-48"></div>
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-700 rounded-lg w-24"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Key metrics skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-5">
                <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Project highlights skeleton */}
          <div>
            <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-5 bg-gray-700 rounded w-32"></div>
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                    <div className="h-3 bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
