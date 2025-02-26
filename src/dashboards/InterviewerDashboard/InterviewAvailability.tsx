import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Trash, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import { format, parse, isValid, isAfter, isToday, startOfDay } from "date-fns";
import toast from "react-hot-toast";
import { InterviewerContext } from "../../context/InterviewerContext";
import "react-datepicker/dist/react-datepicker.css";

// LinkedIn color theme
const LINKEDIN_COLORS = {
  primary: "#0A66C2",
  hover: "#004182",
  background: "#F8F9FA",
  text: "#1D2226",
  secondaryText: "#686D72",
  border: "#DCE6E9",
};

const TimeInput = React.memo(
  ({
    label,
    value,
    min,
    onChange,
  }: {
    label: string;
    value: string;
    min?: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-[#1D2226]">{label}</label>
      <input
        type="time"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 border rounded-md border-[#DCE6E9] focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] bg-white"
      />
    </div>
  )
);

const AvailabilityItem = React.memo(
  ({
    availability,
    onDelete,
  }: {
    availability: any;
    onDelete: (id: string) => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between p-4 bg-white hover:bg-[#F8F9FA] transition-colors border-b border-[#DCE6E9] last:border-b-0"
    >
      <div className="flex items-center gap-4 flex-1">
        <span className="font-semibold text-[#1D2226] min-w-[120px]">
          {format(new Date(availability.date), "MMM d, yyyy")}
        </span>
        <span className="text-[#686D72]">
          {availability.from} - {availability.to}
        </span>
      </div>
      <button
        onClick={() => onDelete(availability._id)}
        className="text-[#666666] hover:text-[#0A66C2] p-1.5 rounded-md transition-colors"
        aria-label="Delete availability"
      >
        <Trash size={18} />
      </button>
    </motion.div>
  )
);

const InterviewAvailability: React.FC = () => {
  const {
    availabilities,
    fetchAvailabilities,
    addAvailability,
    deleteAvailability,
  } = React.useContext(InterviewerContext)!;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const [formState, setFormState] = useState({
    date: null as Date | null,
    from: "",
    to: "",
  });

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

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAvailabilities();
      } catch (error) {
        toast.error("Failed to load availabilities");
      }
    };
    loadData();
  }, [fetchAvailabilities]);

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

  const handleSubmit = useCallback(async () => {
    if (!formState.date || !formState.from || !formState.to) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!validateTimes(formState.from, formState.to, formState.date)) {
      toast.error(
        isTodaySelected
          ? "Start time must be in the future"
          : "End time must be after start time"
      );
      return;
    }

    setIsLoading(true);
    try {
      await addAvailability({
        date: format(formState.date, "MM/dd/yyyy"),
        from: format(parse(formState.from, "HH:mm", formState.date), "h:mm a"),
        to: format(parse(formState.to, "HH:mm", formState.date), "h:mm a"),
      });

      setFormState({ date: null, from: "", to: "" });
      toast.success("Availability added successfully!");
      setIsFormOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save availability"
      );
    } finally {
      setIsLoading(false);
    }
  }, [formState, addAvailability, validateTimes, isTodaySelected]);

  const visibleAvailabilities = useMemo(
    () => availabilities.slice(0, visibleCount),
    [availabilities, visibleCount]
  );

  return (
    <div className="min-h-[80vh] flex items-start justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-[#DCE6E9] w-full max-w-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#DCE6E9]">
          <h1 className="text-xl font-semibold text-[#1D2226]">
            Interview Availability
          </h1>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-2.5 rounded-md hover:bg-[#004182] transition-colors"
          >
            {isFormOpen ? <ChevronUp size={20} /> : <Plus size={20} />}
            {isFormOpen ? "Close" : "New Slot"}
          </button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 border-b border-[#DCE6E9]"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#1D2226]">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={formState.date}
                    onChange={(date) =>
                      setFormState((prev) => ({ ...prev, date }))
                    }
                    minDate={startOfDay(new Date())}
                    placeholderText="Select date"
                    className="w-full p-2.5 border rounded-md border-[#DCE6E9] focus:ring-2 focus:ring-[#0A66C2]"
                    popperPlacement="auto"
                  />
                </div>

                <TimeInput
                  label="Start Time"
                  value={formState.from}
                  min={minFromTime}
                  onChange={(value) =>
                    setFormState((prev) => ({ ...prev, from: value }))
                  }
                />

                <TimeInput
                  label="End Time"
                  value={formState.to}
                  min={minToTime}
                  onChange={(value) =>
                    setFormState((prev) => ({ ...prev, to: value }))
                  }
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-[#0A66C2] text-white px-6 py-3 rounded-md hover:bg-[#004182] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? "Saving..." : "Save Availability"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#1D2226] mb-4">
            Scheduled Time Slots
          </h3>

          <AnimatePresence>
            {availabilities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 bg-[#F8F9FA] rounded-lg"
              >
                <p className="text-[#686D72]">No availability slots found</p>
              </motion.div>
            ) : (
              <>
                <div className="rounded-lg overflow-hidden border border-[#DCE6E9]">
                  <AnimatePresence>
                    {visibleAvailabilities.map((availability) => (
                      <AvailabilityItem
                        key={availability._id}
                        availability={availability}
                        onDelete={deleteAvailability}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {availabilities.length > 5 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {availabilities.length > visibleCount && (
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 5)}
                        className="px-4 py-2 text-[#0A66C2] hover:bg-[#F8F9FA] rounded-md transition-colors font-medium"
                      >
                        Show More
                      </button>
                    )}
                    {visibleCount > 5 && (
                      <button
                        onClick={() => setVisibleCount(5)}
                        className="px-4 py-2 text-[#0A66C2] hover:bg-[#F8F9FA] rounded-md transition-colors font-medium"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(InterviewAvailability);
