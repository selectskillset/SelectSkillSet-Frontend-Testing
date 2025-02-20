import React from "react";

const InterviewerDashboardSkeletonLoader: React.FC = () => {
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
      </aside>

      {/* Overview Section Skeleton */}
      <section className="col-span-full md:col-span-3 bg-white p-6 rounded-lg shadow-lg animate-pulse space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-6 bg-gray-200 rounded-lg">
              <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 w-24 bg-gray-400 rounded"></div>
            </div>
          ))}
        </div>
        {/* Bar Chart */}
        <div className="bg-gray-200 rounded-lg h-96"></div>
      </section>
    </div>
  );
};

export default InterviewerDashboardSkeletonLoader;