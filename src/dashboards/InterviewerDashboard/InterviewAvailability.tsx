import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Trash, Plus, ChevronDown, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { format, parse, isValid, isAfter, isToday, startOfDay } from "date-fns";
import { toast } from "sonner";
import { useInterviewer } from "../../context/InterviewerContext";
import "react-datepicker/dist/react-datepicker.css";

// Memoized Time Input Component
const TimeInput = React.memo(
  ({
    label,
    value,
    min,
    onChange,
    error,
  }: {
    label: string;
    value: string;
    min?: string;
    onChange: (value: string) => void;
    error?: boolean;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="time"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:ring-2 focus:ring-primary focus:border-transparent bg-white`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">Please select a valid time</p>
      )}
    </div>
  )
);

// Memoized Availability Item Component
const AvailabilityItem = React.memo(
  ({
    availability,
    onDelete,
  }: {
    availability: any;
    onDelete: (id: string) => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
            <Calendar size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {format(new Date(availability.date), "EEEE, MMM d, yyyy")}
            </p>
            <p className="text-gray-500 text-sm">
              {availability.from} - {availability.to}
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => onDelete(availability._id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full transition-colors ${
            isHovered ? "text-red-500 bg-red-50" : "text-gray-400"
          }`}
          aria-label="Delete availability"
        >
          <Trash size={18} />
        </motion.button>
      </motion.div>
    );
  }
);

const InterviewAvailability: React.FC = () => {
  const {
    availabilities,
    fetchAvailabilities,
    addAvailability,
    deleteAvailability,
  } = useInterviewer()!;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [formErrors, setFormErrors] = useState({
    date: false,
    from: false,
    to: false,
  });

  const [formState, setFormState] = useState({
    date: null as Date | null,
    from: "",
    to: "",
  });

  // Memoized derived state
  const isTodaySelected = useMemo(
    () => (formState.date ? isToday(formState.date) : false),
    [formState.date]
  );

  const { minFromTime, minToTime } = useMemo(() => {
    const now = new Date();
    const roundedTime = new Date(now);
    roundedTime.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0);

    return {
      minFromTime: isTodaySelected ? format(roundedTime, "HH:mm") : "00:00",
      minToTime:
        formState.from && formState.date
          ? format(parse(formState.from, "HH:mm", formState.date), "HH:mm")
          : "00:00",
    };
  }, [isTodaySelected, formState.from, formState.date]);

  // Fetch data only once when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchAvailabilities();
      } catch (error) {
        toast.error("Failed to load availabilities");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchAvailabilities]);

  // Memoized validation functions
  const validateTimes = useCallback(
    (from: string, to: string, date: Date | null) => {
      if (!date) return false;

      try {
        const start = parse(from, "HH:mm", date);
        const end = parse(to, "HH:mm", date);
        const now = new Date();

        return (
          isValid(start) &&
          isValid(end) &&
          isAfter(end, start) &&
          (!isToday(date) || isAfter(start, now))
        );
      } catch {
        return false;
      }
    },
    []
  );

  const validateForm = useCallback(() => {
    const errors = {
      date: !formState.date,
      from: !formState.from,
      to:
        !formState.to ||
        !validateTimes(formState.from, formState.to, formState.date),
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  }, [formState, validateTimes]);

  // Memoized event handlers
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      await addAvailability({
        date: format(formState.date!, "MM/dd/yyyy"),
        from: format(parse(formState.from, "HH:mm", formState.date!), "h:mm a"),
        to: format(parse(formState.to, "HH:mm", formState.date!), "h:mm a"),
      });

      setFormState({ date: null, from: "", to: "" });
      setFormErrors({ date: false, from: false, to: false });
      toast.success("Availability added successfully!");
      setIsFormOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save availability"
      );
    } finally {
      setIsLoading(false);
    }
  }, [formState, addAvailability, validateForm]);

  const handleDateChange = useCallback((date: Date | null) => {
    setFormState((prev) => ({ ...prev, date }));
    setFormErrors((prev) => ({ ...prev, date: !date }));
  }, []);

  const handleFromChange = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, from: value }));
    setFormErrors((prev) => ({ ...prev, from: !value }));
  }, []);

  const handleToChange = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, to: value }));
    setFormErrors((prev) => ({ ...prev, to: !value }));
  }, []);

  const handleToggleShowMore = useCallback(() => {
    setVisibleCount((prev) => (prev >= availabilities.length ? 5 : prev + 5));
  }, [availabilities.length]);

  // Memoized visible availabilities
  const visibleAvailabilities = useMemo(
    () => availabilities.slice(0, visibleCount),
    [availabilities, visibleCount]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interview Availability
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your available time slots for interviews
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2.5 rounded-lg transition-colors ${
              isFormOpen
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {isFormOpen ? (
              <>
                <ChevronUp size={18} />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>Add New Slot</span>
              </>
            )}
          </button>
        </div>

        {/* Add Availability Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="px-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-gray-200">
                <div className="space-y-1.5 flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={formState.date}
                    onChange={handleDateChange}
                    minDate={startOfDay(new Date())}
                    placeholderText="Select a date"
                    className={`w-full px-3 py-2.5 rounded-lg border ${
                      formErrors.date ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-primary focus:border-transparent`}
                    popperPlacement="auto"
                    dateFormat="MMMM d, yyyy"
                  />
                  {formErrors.date && (
                    <p className="text-xs text-red-500 mt-1">
                      Please select a date
                    </p>
                  )}
                </div>

                <TimeInput
                  label="Start Time"
                  value={formState.from}
                  min={minFromTime}
                  onChange={handleFromChange}
                  error={formErrors.from}
                />

                <TimeInput
                  label="End Time"
                  value={formState.to}
                  min={minToTime}
                  onChange={handleToChange}
                  error={formErrors.to}
                />
              </div>

              <div className="flex justify-end gap-3 pb-6">
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormState({ date: null, from: "", to: "" });
                    setFormErrors({ date: false, from: false, to: false });
                  }}
                  className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Availability"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Availability List Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Scheduled Time Slots
            </h3>
            <div className="text-sm text-gray-500">
              {availabilities.length} total slots
            </div>
          </div>

          {isLoading && availabilities.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : availabilities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-gray-50 rounded-lg"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-primary" size={24} />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">
                No availability slots
              </h4>
              <p className="text-gray-500 max-w-md mx-auto">
                You haven't added any availability slots yet. Click "Add New
                Slot" to schedule your first interview time.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                layout
                className="rounded-lg overflow-hidden border border-gray-200"
              >
                <AnimatePresence>
                  {visibleAvailabilities.map((availability) => (
                    <AvailabilityItem
                      key={availability._id}
                      availability={availability}
                      onDelete={deleteAvailability}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {availabilities.length > 5 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleToggleShowMore}
                    className="flex items-center gap-1 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                  >
                    {visibleCount >= availabilities.length ? (
                      <>
                        <ChevronUp size={16} />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        <span>Show More</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(InterviewAvailability);
