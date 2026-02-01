export default function DevLogSkeleton() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 animate-pulse">
      <div className="h-8 bg-gray-700 rounded-lg w-48 mb-6"></div>
      
      <div className="space-y-6">
        {/* Content textarea skeleton */}
        <div>
          <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-48 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Mood selector skeleton */}
        <div>
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 h-16 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Tags skeleton */}
        <div>
          <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
          <div className="flex flex-wrap gap-2 mb-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-700 rounded-full w-20"></div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-gray-700 rounded-lg"></div>
            <div className="h-12 bg-gray-700 rounded-lg w-20"></div>
          </div>
        </div>

        {/* Submit button skeleton */}
        <div className="h-12 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}
