import { useSearchParams } from "react-router-dom";
import { useMemo, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const TablePage = () => {
  const { data, loading, refetch } = useAdminContext();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("userType") || "candidates";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Refetch data if not available
  useEffect(() => {
    if (!data && !loading) {
      refetch();
    }
  }, [data, loading, refetch]);

  // Table configurations
  const tablesConfig = {
    candidates: {
      title: "Candidates List",
      data: data?.candidates || [],
      columns: [
        "Name",
        "Email",
        "Job Title",
        "Location",
        "Interviews",
        "Actions",
      ],
    },
    interviewers: {
      title: "Interviewers List",
      data: data?.interviewers || [],
      columns: [
        "Name",
        "Email",
        "Job Title",
        "Location",
        "Requests",
        "Actions",
      ],
    },
    corporates: {
      title: "Corporates List",
      data: data?.corporates || [],
      columns: [
        "Company",
        "Email",
        "Company Name",
        "Location",
        "Industry",
        "Actions",
      ],
    },
  };

  // Highlight search text in table cells
  const highlightText = useCallback((text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  }, []);

  // Compute filtered data with pagination
  const filteredData = useMemo(() => {
    const rowsPerPage = 10;
    const filtered = tablesConfig[userType]?.data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
    return {
      data: filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
      totalPages: Math.ceil(filtered.length / rowsPerPage),
    };
  }, [userType, search, page, tablesConfig]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Invalid user type
  if (!tablesConfig[userType]) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">Invalid user type</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-5"
    >
      {/* Main Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Table Title */}
        <h1 className="text-3xl font-bold text-gray-800 px-6 py-4 border-b border-gray-100">
          {tablesConfig[userType].title}
        </h1>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={`Search ${userType}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              aria-label={`Search ${userType}`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            {/* Table Header */}
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
              <tr>
                {tablesConfig[userType].columns.map((column) => (
                  <th key={column} className="px-6 py-3 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {filteredData.data.length > 0 ? (
                filteredData.data.map((item) => (
                  <motion.tr
                    key={item._id || item.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {highlightText(
                        item.firstName || item.contactName,
                        search
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {highlightText(item.email, search)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {highlightText(
                        item.jobTitle || item.companyName || "N/A",
                        search
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {highlightText(item.location || "N/A", search)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.scheduledInterviews?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          navigate(`/admin/${userType}/${item._id}`)
                        }
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        aria-label={`View profile of ${item.firstName}`}
                      >
                        View Profile
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tablesConfig[userType].columns.length}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {filteredData.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) => Math.min(filteredData.totalPages, prev + 1))
            }
            disabled={page === filteredData.totalPages}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TablePage;
