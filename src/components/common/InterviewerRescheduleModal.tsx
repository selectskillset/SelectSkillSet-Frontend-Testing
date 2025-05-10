import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, X } from "lucide-react";
import DatePicker from "react-datepicker";
import {
  format,
  parse,
  isValid,
  isAfter,
  isToday,
  startOfDay,
  isEqual,
  differenceInMinutes,
} from "date-fns";
import {toast} from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { InterviewerContext } from "../../context/InterviewerContext";

interface InterviewRequest {
  id: string;
  date: string; // Format: "EEEE, dd/MM/yyyy"
  from: string; // Format: "h:mm a"
  to: string; // Format: "h:mm a"
  time: string; // Format: "h:mm a"
  status: string;
}

interface InterviewerRescheduleModalProps {
  request: InterviewRequest;
  onClose: () => void;
}

const InterviewerRescheduleModal: React.FC<InterviewerRescheduleModalProps> = ({
  request,
  onClose,
}) => {
  const { rescheduleInterviewRequest } = React.useContext(InterviewerContext)!;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState({ start: "09:00", end: "10:00" });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize dates and times safely
  useEffect(() => {
    const initializeDates = () => {
      try {
        // Parse the date from the request
        const numericDate = request.date.split(", ").pop() || request.date;
        const parsedDate = parse(numericDate, "dd/MM/yyyy", new Date());
        setSelectedDate(isValid(parsedDate) ? parsedDate : new Date());

        // Parse the time range (from and to)
        const parseTime = (time: string) => {
          try {
            const parsed = parse(time.trim(), "h:mm a", new Date());
            return isValid(parsed) ? format(parsed, "HH:mm") : time;
          } catch {
            return time;
          }
        };

        setTimeRange({
          start: parseTime(request.from),
          end: parseTime(request.to),
        });
      } catch (error) {
        console.error("Error initializing dates:", error);
        setSelectedDate(new Date());
      }
    };

    initializeDates();
  }, [request]);

  // Handle keyboard events (Escape key to close modal)
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Validate inputs before submission
  const validateInputs = useCallback(() => {
    const errors: string[] = [];

    if (!selectedDate) {
      errors.push("Please select a date");
    } else {
      // Ensure the selected date is not in the past
      const now = startOfDay(new Date());
      const selectedDay = startOfDay(selectedDate);
      if (selectedDay < now && !isEqual(selectedDay, now)) {
        errors.push("Cannot select past dates");
      }
    }

    // Validate time range
    try {
      const start = parse(timeRange.start, "HH:mm", selectedDate || new Date());
      const end = parse(timeRange.end, "HH:mm", selectedDate || new Date());

      if (!isValid(start) || !isValid(end)) {
        errors.push("Invalid time format");
      } else if (end <= start) {
        errors.push("End time must be after start time");
      } else if (differenceInMinutes(end, start) < 30) {
        errors.push("Minimum session duration is 30 minutes");
      }

      // Check if rescheduling to today's date
      if (selectedDate && isToday(selectedDate)) {
        const now = new Date();
        const bufferMinutes = 15;
        const minimumStart = new Date(now.getTime() + bufferMinutes * 60000);
        if (start < minimumStart) {
          errors.push(
            "Sessions must be scheduled at least 15 minutes in advance"
          );
        }
      }
    } catch (error) {
      errors.push("Invalid time values");
    }

    setValidationError(errors.length > 0 ? errors.join(", ") : null);
    return errors.length === 0;
  }, [selectedDate, timeRange]);

  // Handle rescheduling logic
  const handleReschedule = async () => {
    if (!validateInputs() || !selectedDate) return;

    setIsSubmitting(true);
    try {
      // Format date as "EEEE, dd/MM/yyyy" (e.g., "Thursday, 20/02/2025")
      const newDate = format(selectedDate, "EEEE, dd/MM/yyyy");

      // Format times with AM/PM and leading zeros
      const fromTime = format(
        parse(timeRange.start, "HH:mm", selectedDate),
        "h:mm a"
      );
      const toTime = format(
        parse(timeRange.end, "HH:mm", selectedDate),
        "h:mm a"
      );

      // Create ISO date string for backend sorting
      const isoDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      ).toISOString();

      await rescheduleInterviewRequest(request.id, {
        newDate, // Format: "EEEE, dd/MM/yyyy"
        from: fromTime,
        to: toTime,
        isoDate, // ISO string for backend sorting
      });

      toast.success("Reschedule request sent successfully");
      onClose();
    } catch (error: any) {
      console.error("Rescheduling failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to reschedule interview"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out past dates in the date picker
  const filterDates = (date: Date) => {
    return (
      isAfter(date, startOfDay(new Date())) ||
      isEqual(date, startOfDay(new Date()))
    );
  };


  console.log(request)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Reschedule Interview
          </h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-white/50 rounded-full"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Calendar className="w-5 h-5 text-blue-500" />
                Select New Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                filterDate={filterDates}
                dateFormat="dd/MM/yyyy" // Display as DD/MM/YYYY
                className="w-full p-2 border rounded-lg"
                placeholderText="Select a date"
                popperPlacement="bottom-start"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Clock className="w-5 h-5 text-purple-500" />
                Time Slot
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={timeRange.start}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    if (newStart >= timeRange.end) {
                      setTimeRange((prev) => ({
                        start: newStart,
                        end: format(
                          parse(newStart, "HH:mm", new Date()).getTime() +
                            30 * 60000,
                          "HH:mm"
                        ),
                      }));
                    } else {
                      setTimeRange((prev) => ({ ...prev, start: newStart }));
                    }
                  }}
                  className="w-full p-2 border rounded-lg"
                  step={300} // 5-minute increments
                />
                <input
                  type="time"
                  value={timeRange.end}
                  min={timeRange.start}
                  onChange={(e) =>
                    setTimeRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                  step={300}
                />
              </div>
            </div>
            {validationError && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {validationError}
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-medium mb-2">Original Schedule</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{request.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {request.time}
                    
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleReschedule}
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Processing..." : "Confirm Reschedule"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(InterviewerRescheduleModal);