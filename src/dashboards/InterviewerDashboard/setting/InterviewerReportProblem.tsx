import React from "react";

const InterviewerReportProblem: React.FC = () => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Report a Problem</h3>
      <p className="text-gray-600 mb-4">
        Describe the issue you're facing, and we'll get back to you as soon as possible.
      </p>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Description
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0A66C2]"
            placeholder="Describe the problem in detail..."
          ></textarea>
        </div>
        <button className="bg-[#0A66C2] text-white px-4 py-2 rounded-lg hover:bg-[#005885] transition">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default InterviewerReportProblem;