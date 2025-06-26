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

  useEffect(() => {
    if (!data && !loading) {
      refetch();
    }
  }, [data, loading, refetch]);

  const tablesConfig = {
    candidates: {
      title: "Candidates List",
      data: data?.candidates || [],
      columns: ["Name", "Email", "Job Title", "Location", "Interviews", "Actions"],
    },
    interviewers: {
      title: "Interviewers List",
      data: data?.interviewers || [],
      columns: [
        "Name",
        "Verification",
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

  const highlightText = useCallback((text, query) => {
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

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
      className="min-h-screen p-4"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-800 px-6 py-4 border-b border-gray-200">
          {tablesConfig[userType].title}
        </h1>

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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tablesConfig[userType].columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.data.length > 0 ? (
                filteredData.data.map((item) => (
                  <motion.tr
                    key={item._id || item.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {highlightText(
                        item.firstName || item.contactName,
                        search
                      )}
                    </td>
                    {userType === "interviewers" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.isVerified ? (
                          <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                            Not Verified
                          </span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {highlightText(item.email, search)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {highlightText(
                        item.jobTitle || item.companyName || "N/A",
                        search
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {highlightText(item.location || "N/A", search)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userType === "interviewers"
                        ? item.interviewRequests?.length || 0
                        : item.scheduledInterviews?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/admin/${userType}/${item._id}`)}
                        className="text-blue-600 hover:text-blue-900"
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
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TablePage;
