import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import DatePicker from "react-datepicker";
import {
  format,
  parse,
  isValid,
  isAfter,
  isToday,
  startOfDay,
  isBefore,
} from "date-fns";
import toast from "react-hot-toast";
import { InterviewerContext } from "../../context/InterviewerContext";
import "react-datepicker/dist/react-datepicker.css";

const getCurrentTimeRounded = () => {
  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
  now.setSeconds(0);
  return now;
};

const InterviewAvailability: React.FC = () => {
  const {
    availabilities,
    fetchAvailabilities,
    addAvailability,
    deleteAvailability,
  } = React.useContext(InterviewerContext)!;

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const [formState, setFormState] = useState({
    date: null as Date | null,
    from: "",
    to: "",
  });

  const currentDate = useMemo(() => new Date(), []);
  const isTodaySelected = useMemo(
    () => (formState.date ? isToday(formState.date) : false),
    [formState.date]
  );

  const minFromTime = useMemo(() => {
    if (!isTodaySelected) return "00:00";
    return format(getCurrentTimeRounded(), "HH:mm");
  }, [isTodaySelected]);

  const minToTime = useMemo(() => {
    if (!formState.from || !formState.date) return minFromTime;
    const fromDate = parse(formState.from, "HH:mm", formState.date);
    return format(fromDate, "HH:mm");
  }, [formState.from, formState.date, minFromTime]);

  const validateTimes = useCallback(
    (from: string, to: string, date: Date | null) => {
      try {
        if (!date) return false;
        const now = new Date();

        const start = parse(from, "HH:mm", date);
        const end = parse(to, "HH:mm", date);

        if (isToday(date) && isBefore(start, now)) {
          return false;
        }

        return isValid(start) && isValid(end) && isAfter(end, start);
      } catch {
        return false;
      }
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    const { date, from, to } = formState;

    if (!date || !from || !to) {
      toast.error("Please fill all fields");
      return;
    }

    if (!validateTimes(from, to, date)) {
      toast.error(
        isTodaySelected
          ? "Start time cannot be in the past"
          : "End time must be after start time"
      );
      return;
    }

    setIsLoading(true);
    try {
      await addAvailability({
        date: format(date, "MM/dd/yyyy"),
        from: format(parse(from, "HH:mm", date), "h:mm a"),
        to: format(parse(to, "HH:mm", date), "h:mm a"),
      });

      setFormState({ date: null, from: "", to: "" });
      toast.success("Availability added!");
      setIsAccordionOpen(false);
    } catch (error) {
      toast.error(error.message || "Error saving availability");
    } finally {
      setIsLoading(false);
    }
  }, [formState, addAvailability, validateTimes, isTodaySelected]);

  const visibleAvailabilities = useMemo(
    () => availabilities.slice(0, visibleCount),
    [availabilities, visibleCount]
  );

  const toggleAccordion = useCallback(() => {
    setIsAccordionOpen((prev) => {
      if (!prev) setFormState({ date: null, from: "", to: "" });
      return !prev;
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto my-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Interview Availability
        </h1>
        <button
          onClick={toggleAccordion}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isAccordionOpen ? "Close" : "Add New"}
          {isAccordionOpen ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      </div>

      <motion.div
        animate={isAccordionOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 },
        }}
        className="overflow-hidden"
      >
        <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formState.date}
                onChange={(date) => setFormState((prev) => ({ ...prev, date }))}
                minDate={startOfDay(new Date())}
                placeholderText="Select date"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                popperPlacement="auto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formState.from}
                min={minFromTime}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, from: e.target.value }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formState.to}
                min={minToTime}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, to: e.target.value }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Saving..." : "Save Availability"}
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Scheduled Availability
        </h3>

        {availabilities.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No availability slots added yet</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
              {visibleAvailabilities.map((availability) => (
                <div
                  key={availability._id}
                  className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-800">
                      {format(new Date(availability.date), "MMM d, yyyy")}
                    </span>
                    <span className="text-gray-600">
                      {availability.from} - {availability.to}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteAvailability(availability._id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded-md transition-colors"
                    aria-label="Delete availability"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>

            {availabilities.length > 5 && (
              <div className="flex justify-center gap-2 mt-4">
                {availabilities.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Show More
                  </button>
                )}
                {visibleCount > 5 && (
                  <button
                    onClick={() => setVisibleCount(5)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(InterviewAvailability);
