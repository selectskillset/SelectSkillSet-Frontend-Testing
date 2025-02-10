import { useMemo, useState } from "react";
import { TableIcon, Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

const DashboardTables = ({ candidates, interviewers, corporates, navigate }) => {
  // State management for each table
  const [tableState, setTableState] = useState({
    candidates: { search: "", page: 1 },
    interviewers: { search: "", page: 1 },
    corporates: { search: "", page: 1 }
  });

  // Configuration for tables
  const tablesConfig = [
    { 
      key: 'candidates',
      title: 'Candidates List',
      data: candidates,
      columns: ['Name', 'Email', 'Job Title', 'Location', 'Interviews', 'Actions']
    },
    { 
      key: 'interviewers',
      title: 'Interviewers List',
      data: interviewers,
      columns: ['Name', 'Email', 'Job Title', 'Location', 'Requests', 'Actions']
    },
    { 
      key: 'corporates',
      title: 'Corporates List',
      data: corporates,
      columns: ['Company', 'Email', 'Company Name', 'Location', 'Industry', 'Actions']
    }
  ];

  // Highlight matching text with better accessibility
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-100 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Memoized filtered data with pagination
  const getFilteredData = (data, searchKey) => {
    const { search, page } = tableState[searchKey];
    const rowsPerPage = 10;

    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

    return {
      data: filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
      totalPages: Math.ceil(filtered.length / rowsPerPage),
      totalItems: filtered.length
    };
  };

  // Table row renderer
  const TableRow = ({ item, type, searchQuery }) => (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      <td className="p-4">
        {highlightText(
          `${item.firstName || item.contactName} ${item.lastName || ''}`,
          searchQuery
        )}
      </td>
      <td className="p-4">{item.email}</td>
      <td className="p-4">
        {type === 'corporates' ? item.companyName : item.jobTitle || 'N/A'}
      </td>
      <td className="p-4">{item.location || 'N/A'}</td>
      <td className="p-4">
        {type === 'corporates' 
          ? item.industry 
          : item.scheduledInterviews?.length || 0}
      </td>
      <td className="p-4">
        <button
          onClick={() => navigate(`/admin/${type}/${item._id}`)}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md transition-colors"
        >
          View Profile
        </button>
      </td>
    </tr>
  );

  // Pagination controls
  const Pagination = ({ totalPages, searchKey }) => {
    const { page } = tableState[searchKey];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    return (
      <div className="flex items-center justify-between mt-4 px-4">
        <div className="text-sm text-gray-600">
          Showing {((page - 1) * 10) + 1} - {Math.min(page * 10, tableState[searchKey].totalItems)} of {tableState[searchKey].totalItems}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setTableState(prev => ({
              ...prev,
              [searchKey]: { ...prev[searchKey], page: prev[searchKey].page - 1 }
            }))}
            disabled={page === 1}
            className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setTableState(prev => ({
                ...prev,
                [searchKey]: { ...prev[searchKey], page: startPage + idx }
              }))}
              className={`px-3 py-1 rounded-md ${
                page === startPage + idx 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {startPage + idx}
            </button>
          ))}
          <button
            onClick={() => setTableState(prev => ({
              ...prev,
              [searchKey]: { ...prev[searchKey], page: prev[searchKey].page + 1 }
            }))}
            disabled={page === totalPages}
            className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 mt-8">
      {tablesConfig.map(({ key, title, columns }) => {
        const { data, totalPages, totalItems } = getFilteredData(tablesConfig.find(t => t.key === key).data, key);
        
        return (
          <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TableIcon size={20} className="text-blue-600" />
                {title}
              </h3>
              <div className="relative w-72">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={tableState[key].search}
                  onChange={(e) => setTableState(prev => ({
                    ...prev,
                    [key]: { ...prev[key], search: e.target.value }
                  }))}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    {columns.map((column) => (
                      <th key={column} className="p-4 font-medium text-left">
                        <div className="flex items-center gap-1">
                          {column}
                          <button className="text-gray-400 hover:text-gray-600">
                            <ArrowUpDown size={14} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {data.length > 0 ? (
                    data.map((item) => (
                      <TableRow
                        key={item._id}
                        item={item}
                        type={key}
                        searchQuery={tableState[key].search}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalItems > 10 && <Pagination totalPages={totalPages} searchKey={key} />}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardTables;