export default function SessionTimerSkeleton() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 animate-pulse">
      <div className="h-8 bg-gray-700 rounded-lg w-48 mb-6"></div>
      
      <div className="space-y-6">
        {/* Timer display skeleton */}
        <div className="text-center">
          <div className="h-16 bg-gray-700 rounded-lg mb-2 max-w-md mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-32 mx-auto"></div>
        </div>

        {/* Project input skeleton */}
        <div>
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Tags input skeleton */}
        <div>
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Action button skeleton */}
        <div className="h-12 bg-gray-700 rounded-lg"></div>

        {/* Stats skeleton */}
        <div className="pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-700 rounded-lg mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
