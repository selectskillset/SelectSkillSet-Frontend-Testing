import { FC } from "react";

const ProfileSkeletonLoader: FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5 flex-1">
          <div className="w-20 h-20 rounded-full bg-gray-200" />
          <div className="space-y-2 flex-1">
            <div className="h-7 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <div className="w-24 h-9 bg-gray-200 rounded-md" />
          <div className="w-32 h-9 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Two Column Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Skills & Experience */}
        <div className="space-y-6">
          {/* Skills Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-200 rounded-full"
                  style={{ width: `${Math.random() * 40 + 60}px` }}
                />
              ))}
            </div>
          </div>

          {/* Experience Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Resume Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="w-32 h-9 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* Performance Overview Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
        
        {/* Average Rating Skeleton */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded w-36" />
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Items Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeletonLoader;