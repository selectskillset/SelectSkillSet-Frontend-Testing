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

interface RescheduleRequest {
  id: string;
  date: string;
  status: string;
  from: string; // Add from/to to interface
  to: string;
}

interface RescheduleData {
  id: string;
  newDate: string;
  startTime: string;
  endTime: string;
  isoDate: string;
}

interface CandidateRescheduleModalProps {
  request: RescheduleRequest;
  onClose: () => void;
  onReschedule: (data: RescheduleData) => Promise<void>;
}

const ERROR_MESSAGES = {
  DATE_REQUIRED: "Please select a date",
  PAST_DATE: "Cannot select past dates",
  TIME_FORMAT: "Invalid time format",
  TIME_ORDER: "End time must be after start time",
  DURATION: "Minimum session duration is 30 minutes",
  ADVANCE_NOTICE: "Sessions must be scheduled at least 15 minutes in advance",
  GENERAL: "Invalid time values",
};

const TIME_SETTINGS = {
  DEFAULT_START: "09:00",
  DEFAULT_END: "10:00",
  MIN_DURATION: 30,
  BUFFER_MINUTES: 15,
};

const CandidateRescheduleModal: React.FC<CandidateRescheduleModalProps> = ({
  request,
  onClose,
  onReschedule,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState({
    start: TIME_SETTINGS.DEFAULT_START,
    end: TIME_SETTINGS.DEFAULT_END,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Improved date initialization with proper time parsing
  useEffect(() => {
    const initializeDateTime = () => {
      try {
        // Date initialization
        const numericDate = request.date.split(", ").pop() || request.date;
        const parsedDate = parse(numericDate, "dd/MM/yyyy", new Date());
        setSelectedDate(isValid(parsedDate) ? parsedDate : new Date());

        // Use from/to directly instead of time property
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
        console.error("Initialization error:", error);
        setSelectedDate(new Date());
      }
    };

    if (request.status === "Approved") {
      initializeDateTime();
    }
  }, [request]);

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

  const validateInputs = useCallback(() => {
    const errors: string[] = [];

    if (!selectedDate) {
      errors.push(ERROR_MESSAGES.DATE_REQUIRED);
    } else {
      const now = startOfDay(new Date());
      const selectedDay = startOfDay(selectedDate);
      if (selectedDay < now && !isEqual(selectedDay, now)) {
        errors.push(ERROR_MESSAGES.PAST_DATE);
      }
    }

    try {
      const start = parse(timeRange.start, "HH:mm", selectedDate || new Date());
      const end = parse(timeRange.end, "HH:mm", selectedDate || new Date());

      if (!isValid(start) || !isValid(end)) {
        errors.push(ERROR_MESSAGES.TIME_FORMAT);
      } else if (end <= start) {
        errors.push(ERROR_MESSAGES.TIME_ORDER);
      } else if (differenceInMinutes(end, start) < TIME_SETTINGS.MIN_DURATION) {
        errors.push(ERROR_MESSAGES.DURATION);
      }

      if (selectedDate && isToday(selectedDate)) {
        const minimumStart = new Date(
          Date.now() + TIME_SETTINGS.BUFFER_MINUTES * 60000
        );
        if (start < minimumStart) {
          errors.push(ERROR_MESSAGES.ADVANCE_NOTICE);
        }
      }
    } catch (error) {
      errors.push(ERROR_MESSAGES.GENERAL);
    }

    setValidationError(errors.length > 0 ? errors.join(", ") : null);
    return errors.length === 0;
  }, [selectedDate, timeRange]);

  const handleReschedule = useCallback(async () => {
    if (!validateInputs() || !selectedDate) return;

    setIsSubmitting(true);
    try {
      const newDate = format(selectedDate, "EEEE, dd/MM/yyyy");
      const isoDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      ).toISOString();

      await onReschedule({
        id: request.id,
        newDate,
        startTime: format(
          parse(timeRange.start, "HH:mm", new Date()),
          "h:mm a"
        ),
        endTime: format(parse(timeRange.end, "HH:mm", new Date()), "h:mm a"),
        isoDate,
      });

      toast.success("Reschedule request sent successfully");
      onClose();
    } catch (error: unknown) {
      console.error("Rescheduling failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to reschedule interview";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateInputs,
    selectedDate,
    onReschedule,
    request.id,
    timeRange,
    onClose,
  ]);

  const filterDates = useCallback(
    (date: Date) =>
      isAfter(date, startOfDay(new Date())) ||
      isEqual(date, startOfDay(new Date())),
    []
  );

  const handleStartTimeChange = useCallback((newStart: string) => {
    setTimeRange((prev) => {
      const updatedEnd =
        newStart >= prev.end
          ? format(
              parse(newStart, "HH:mm", new Date()).getTime() + 30 * 60000,
              "HH:mm"
            )
          : prev.end;
      return { start: newStart, end: updatedEnd };
    });
  }, []);

  const handleEndTimeChange = useCallback((newEnd: string) => {
    setTimeRange((prev) => ({ ...prev, end: newEnd }));
  }, []);

  if (request.status !== "Approved") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="reschedule-modal-title"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
          <h2
            id="reschedule-modal-title"
            className="text-xl font-bold text-gray-900"
          >
            Reschedule Interview
          </h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-white/50 rounded-full transition-colors"
            aria-label="Close reschedule modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Date Selection */}
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
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                popperPlacement="bottom-start"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <Clock className="w-5 h-5 text-purple-500" />
                Time Slot
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={timeRange.start}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="300"
                  aria-label="Select start time"
                />
                <input
                  type="time"
                  value={timeRange.end}
                  min={timeRange.start}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="300"
                  aria-label="Select end time"
                />
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div
                role="alert"
                className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100"
              >
                {validationError}
              </div>
            )}

            {/* Original Schedule */}
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
                    {request.from}- {request.to}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleReschedule}
            disabled={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "primary hover:bg-blue-700 text-white"
            }`}
            aria-label={
              isSubmitting ? "Processing reschedule" : "Confirm reschedule"
            }
          >
            {isSubmitting ? "Processing..." : "Confirm Reschedule"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(CandidateRescheduleModal);
