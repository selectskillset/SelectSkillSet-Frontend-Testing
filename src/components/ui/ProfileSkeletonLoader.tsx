import { FC } from "react";

const ProfileSkeletonLoader: FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5 flex-1 min-w-[300px]">
          <div className="w-20 h-20 rounded-full bg-gray-200" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills and Resume Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-200 rounded-full"
                  style={{ width: `${Math.random() * 50 + 50}px` }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-9 bg-gray-200 rounded-lg w-32" />
          </div>
        </div>

        {/* Scheduled Interviews Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 space-y-3">
                <div className="flex flex-wrap gap-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-9 h-9 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeletonLoader;
