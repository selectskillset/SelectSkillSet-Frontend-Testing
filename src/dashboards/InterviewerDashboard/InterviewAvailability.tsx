import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import DatePicker from "react-datepicker";
import { format, parse, isValid, isAfter } from "date-fns";
import toast from "react-hot-toast";
import { InterviewerContext } from "../../context/InterviewerContext";
import "react-datepicker/dist/react-datepicker.css";

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

  // Form state
  const [formState, setFormState] = useState({
    date: null as Date | null,
    from: "",
    to: "",
  });

  // Memoized fetch function
  const loadAvailabilities = useCallback(async () => {
    // Always fetch if no availabilities exist
    if (availabilities.length === 0) {
      await fetchAvailabilities();
    }
  }, [availabilities, fetchAvailabilities]); // Keep dependencies
  
  // Initial load
  useEffect(() => {
    loadAvailabilities();
  }, [loadAvailabilities]);
  // Time validation
  const validateTimes = useCallback((from: string, to: string) => {
    try {
      const start = parse(from, "HH:mm", new Date());
      const end = parse(to, "HH:mm", new Date());
      return isValid(start) && isValid(end) && isAfter(end, start);
    } catch {
      return false;
    }
  }, []);

  // Form submission handler
  const handleSubmit = useCallback(async () => {
    const { date, from, to } = formState;

    if (!date || !from || !to) {
      toast.error("Please fill all fields");
      return;
    }

    if (!validateTimes(from, to)) {
      toast.error("End time must be after start time");
      return;
    }

    setIsLoading(true);
    try {
      await addAvailability({
        date: format(date, "MM/dd/yyyy"),
        from: format(parse(from, "HH:mm", new Date()), "h:mm a"),
        to: format(parse(to, "HH:mm", new Date()), "h:mm a"),
      });

      setFormState({ date: null, from: "", to: "" });
      toast.success("Availability added!");
      setIsAccordionOpen(false);
    } catch (error) {
      toast.error(error.message || "Error saving availability");
    } finally {
      setIsLoading(false);
    }
  }, [formState, addAvailability, validateTimes]);

  // Memoized availability list
  const visibleAvailabilities = useMemo(
    () => availabilities.slice(0, visibleCount),
    [availabilities, visibleCount]
  );

  // Toggle accordion
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
      className="bg-white rounded-2xl p-6 shadow-lg border my-32 border-gray-200 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Interview Availability
        </h1>
        <button
          onClick={toggleAccordion}
          className="flex items-center gap-2 bg-[#0A66C2] text-white px-5 py-3 rounded-lg hover:bg-[#004182] transition"
        >
          {isAccordionOpen ? "Close Form" : "Add Availability"}
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
        <div className="space-y-6 bg-[#F3F6F8] p-6 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <DatePicker
                selected={formState.date}
                onChange={(date) => setFormState((prev) => ({ ...prev, date }))}
                minDate={new Date()}
                placeholderText="Select date"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formState.from}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, from: e.target.value }))
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formState.to}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, to: e.target.value }))
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Scheduled Availability
        </h3>

        {availabilities.length === 0 ? (
          <div className="text-center py-6 bg-[#F3F6F8] rounded-xl">
            <p className="text-gray-500">No availability slots added yet</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {visibleAvailabilities.map((availability) => (
                <div
                  key={availability._id}
                  className="flex items-center justify-between p-4 bg-white hover:bg-[#F3F6F8] transition"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                      {format(new Date(availability.date), "MMM d, yyyy")}
                    </span>
                    <span className="text-gray-600 ml-4">
                      {availability.from} - {availability.to}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteAvailability(availability._id)}
                    className="text-red-600 hover:text-red-700 transition"
                    aria-label="Delete availability"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>

            {availabilities.length > 5 && (
              <div className="flex justify-center gap-4 mt-6">
                {availabilities.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="btn-secondary"
                  >
                    Show More
                  </button>
                )}
                {visibleCount > 5 && (
                  <button
                    onClick={() => setVisibleCount(5)}
                    className="btn-secondary"
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
