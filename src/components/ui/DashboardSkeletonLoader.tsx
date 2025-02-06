// DashboardSkeletonLoader.tsx
import React from "react";

const DashboardSkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 mt-12">
      {/* Profile Card */}
      <aside className="col-span-full md:col-span-1 bg-white p-6 rounded-lg shadow-lg animate-pulse">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        </div>

        {/* Name and Job Title */}
        <div className="space-y-2 mb-4">
          <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
        </div>

        {/* Edit Profile Button */}
        <div className="h-10 w-full bg-gray-300 rounded mb-6"></div>

        {/* Skills Section */}
        <div className="mb-6">
          <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-6 w-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>

        {/* Profile Insights */}
        <div className="mb-6">
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-36 bg-gray-300 rounded"></div>
            <div className="h-4 w-40 bg-gray-300 rounded"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="col-span-full md:col-span-3 flex flex-col gap-8">
        {/* Profile Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
          <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex justify-between">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-36 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
          <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeletonLoader;
