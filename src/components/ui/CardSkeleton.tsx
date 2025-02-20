import React from "react";
import Skeleton from "./Skeleton";

const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start">
        {/* Profile Photo Skeleton */}
        <Skeleton className="w-12 h-12 rounded-full" />
        {/* Request Details Skeleton */}
        <div className="ml-4 flex-1 space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-48 h-3" />
          <Skeleton className="w-40 h-3" />
        </div>
      </div>
      {/* Action Buttons Skeleton */}
      <div className="mt-4 flex gap-2">
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-20 h-8 rounded-full" />
      </div>
    </div>
  );
};

export default CardSkeleton;