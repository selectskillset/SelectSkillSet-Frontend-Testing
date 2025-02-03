import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import axiosInstance from "../../components/common/axiosConfig";
import toast from "react-hot-toast";

interface Availability {
  date: string;
  from: string;
  to: string;
  _id: string;
}

const InterviewAvailability: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<
    {
      date: string;
      from: string;
      to: string;
    }[]
  >([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    date: string | null;
    from: string | null;
    to: string | null;
  }>({
    date: null,
    from: null,
    to: null,
  });

  const [visibleAvailabilities, setVisibleAvailabilities] = useState(5); // Track visible availabilities

  const fetchAvailabilities = async () => {
    try {
      const response = await axiosInstance.get("/interviewer/getAvailability");
      if (response.data?.success) {
        setAvailabilities(response.data.availability || []);
      }
    } catch (error) {
      toast.error("Error fetching availabilities.");
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return null;
    const date = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Ensures AM/PM format
    };
    return date.toLocaleTimeString("en-US", options);
  };

  const handleSubmit = async () => {
    if (currentSelection.date && currentSelection.from && currentSelection.to) {
      // Format the date
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }).format(new Date(currentSelection.date));

      // Format the from and to times
      const formattedFrom = formatTime(currentSelection.from);
      const formattedTo = formatTime(currentSelection.to);

      if (!formattedFrom || !formattedTo) {
        toast.error("Invalid time format.");
        return;
      }

      // Prepare the payload with formatted date and time
      const updatedDates = [
        ...selectedDates,
        {
          date: formattedDate, // Only the date
          from: formattedFrom, // Time from
          to: formattedTo, // Time to
        },
      ];

      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/interviewer/addAvailability",
          {
            dates: updatedDates.map((d) => ({
              date: d.date,
              from: d.from, // Send date and time separately
              to: d.to, // Send date and time separately
            })),
          }
        );
        if (response.data?.success) {
          fetchAvailabilities();
          setSelectedDates([]); // Clear after successful save
          toast.success("Availabilities saved successfully.");
          setIsAccordionOpen(false);
        } else {
          toast.error("Failed to save availabilities.");
        }
      } catch (error) {
        toast.error("Error saving availabilities.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const response = await axiosInstance.delete(
        "/interviewer/deleteAvailability",
        {
          data: { id },
        }
      );
      if (response.data?.success) {
        fetchAvailabilities();
        toast.success("Availability deleted successfully.");
      } else {
        toast.error("Failed to delete availability.");
      }
    } catch (error) {
      toast.error("Error deleting availability.");
    }
  };

  const handleClose = () => {
    setIsAccordionOpen(false); // Close the modal when the close button is clicked
  };

  const handleViewMore = () => {
    setVisibleAvailabilities((prev) => prev + 5); // Show 5 more availabilities
  };

  const handleViewLess = () => {
    setVisibleAvailabilities((prev) => Math.max(prev - 5, 5)); // Show 5 less availabilities, but not less than 5
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto border border-gray-300"
    >
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">
        Availability Scheduler
      </h2>

      <div
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        className="flex justify-between items-center bg-blue-50 text-blue-800 px-5 py-4 rounded-xl shadow-md cursor-pointer transition hover:bg-blue-100"
      >
        <h3 className="text-xl font-semibold">Set Available Dates and Times</h3>
        {isAccordionOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>

      {isAccordionOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 bg-gray-50 p-5 rounded-xl shadow-md"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="date"
                className="block text-lg font-medium text-gray-700"
              >
                Select Date
              </label>
              <Datetime
                onChange={(date) =>
                  setCurrentSelection((prev) => ({
                    ...prev,
                    date: date ? date.toISOString() : null,
                  }))
                }
                closeOnSelect
                timeFormat={false}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-6">
              <div className="flex-1">
                <label
                  htmlFor="from"
                  className="block text-lg font-medium text-gray-700"
                >
                  From
                </label>
                <Datetime
                  onChange={(time) =>
                    setCurrentSelection((prev) => ({
                      ...prev,
                      from: time ? new Date(time).toISOString() : null,
                    }))
                  }
                  dateFormat={false}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="to"
                  className="block text-lg font-medium text-gray-700"
                >
                  To
                </label>
                <Datetime
                  onChange={(time) =>
                    setCurrentSelection((prev) => ({
                      ...prev,
                      to: time ? new Date(time).toISOString() : null,
                    }))
                  }
                  dateFormat={false}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleSubmit}
              className={`px-5 py-3 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-semibold rounded-lg shadow-lg transition`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800">
          Your Availabilities
        </h3>
        {availabilities.length > 0 ? (
          <ul className="divide-y divide-gray-200 mt-4">
            {availabilities.slice(0, visibleAvailabilities).map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center py-3 px-4 mb-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <span className="text-gray-800">
                  {new Date(item.date).toLocaleDateString()} - {item.from} to{" "}
                  {item.to}
                </span>
                <button
                  onClick={() => deleteAvailability(item._id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No availabilities set yet.</p>
        )}

        {availabilities.length > visibleAvailabilities && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleViewMore}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              View More
            </button>
          </div>
        )}

        {visibleAvailabilities > 5 && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleViewLess}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition"
            >
              View Less
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InterviewAvailability;
