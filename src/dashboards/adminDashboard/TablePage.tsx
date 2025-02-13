import { useSearchParams } from "react-router-dom";
import { useMemo, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TablePage = () => {
  const { data, loading, refetch } = useAdminContext();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("userType") || "candidates";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!data && !loading) {
      refetch();
    }
  }, [data, loading, refetch]);

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
  const highlightText = useCallback((text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">
          Loading data...
        </div>
      </div>
    );
  }

  if (!tablesConfig[userType]) {
    return <div>Invalid user type</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5"
    >
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6">
        {/* Table Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          {tablesConfig[userType].title}
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Search ${userType}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label={`Search ${userType}`}
          />
        </div>

        {/* Table */}
        <div className="h-[90vh] rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {tablesConfig[userType].columns.map((column) => (
                  <th
                    key={column}
                    className="p-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
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
                    <td className="p-4 text-sm text-gray-700">
                      {highlightText(
                        item.firstName || item.contactName,
                        search
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {highlightText(item.email, search)}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {highlightText(
                        item.jobTitle || item.companyName || "N/A",
                        search
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {highlightText(item.location || "N/A", search)}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {item.scheduledInterviews?.length || 0}
                    </td>
                    <td className="p-4">
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
                    className="p-6 text-center text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
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
