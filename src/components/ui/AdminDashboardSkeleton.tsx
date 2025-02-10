
export const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-5 mt-16">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 bg-white rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-xl" />
              </div>
              <div className="mt-4 h-1 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Bar Chart Skeleton */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-80 relative">
              <div className="h-full w-full bg-gray-200 rounded-lg">
                <div className="flex items-end h-full space-x-2 p-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-3/4 w-1/4 bg-gray-300 rounded-t"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Doughnut Chart Skeleton */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-80 relative flex items-center justify-center">
              <div className="h-48 w-48 bg-gray-200 rounded-full">
                <div className="absolute inset-0 m-auto h-24 w-24 bg-white rounded-full" />
              </div>
            </div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-1/3 mx-auto" />
          </div>
        </div>

        {/* Shimmer Animation */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>
    </div>
  );
};