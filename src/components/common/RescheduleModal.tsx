// RescheduleModal.tsx
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
} from "date-fns";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "./axiosConfig";

interface RescheduleModalProps {
  request: any;
  onClose: () => void;
  onConfirm: (newDate: string, newTime: string) => Promise<void>;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  request,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    try {
      return parse(request.date, "dd/MM/yyyy", new Date());
    } catch {
      return startOfDay(new Date());
    }
  });
  const [timeRange, setTimeRange] = useState(() => {
    try {
      const [start, end] = request.time.split(" - ");
      return {
        start: format(parse(start, "h:mm a", new Date()), "HH:mm"),
        end: format(parse(end, "h:mm a", new Date()), "HH:mm"),
      };
    } catch {
      return { start: "09:00", end: "10:00" };
    }
  });

  const originalDateTime = useCallback(() => {
    try {
      const originalDate = parse(request.date, "dd/MM/yyyy", new Date());
      const [originalStart] = request.time.split(" - ");
      return parse(originalStart, "h:mm a", originalDate);
    } catch {
      return null;
    }
  }, [request.date, request.time]);

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

  const validateTimes = useCallback(() => {
    if (!selectedDate) return false;

    try {
      const start = parse(timeRange.start, "HH:mm", selectedDate);
      const end = parse(timeRange.end, "HH:mm", selectedDate);
      const now = new Date();
      const original = originalDateTime();

      const isSameAsOriginal =
        original &&
        isEqual(selectedDate, parse(request.date, "dd/MM/yyyy", new Date())) &&
        isEqual(start, original);

      return (
        isValid(start) &&
        isValid(end) &&
        isAfter(end, start) &&
        (!isToday(selectedDate) || isAfter(start, now)) &&
        !isSameAsOriginal
      );
    } catch {
      return false;
    }
  }, [selectedDate, timeRange, originalDateTime, request.date]);

  const handleReschedule = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (!validateTimes()) {
      if (
        isToday(selectedDate) &&
        !isAfter(parse(timeRange.start, "HH:mm", selectedDate), new Date())
      ) {
        toast.error("Start time must be in the future");
        return;
      }

      const original = originalDateTime();
      if (
        original &&
        isEqual(selectedDate, parse(request.date, "dd/MM/yyyy", new Date())) &&
        isEqual(parse(timeRange.start, "HH:mm", selectedDate), original)
      ) {
        toast.error(
          "Please select a different date or time than the original schedule"
        );
        return;
      }

      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);
    try {
      const newDate = format(selectedDate, "dd/MM/yyyy");
      const newTime = `${format(
        parse(timeRange.start, "HH:mm", selectedDate),
        "h:mm a"
      )} - ${format(parse(timeRange.end, "HH:mm", selectedDate), "h:mm a")}`;

      const response = await axiosInstance(
        `/interview/${request.id}/reschedule`,
        {
          date: newDate,
          time: newTime,
          interviewId: request.id,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reschedule interview");
      }

      await onConfirm(newDate, newTime);
      toast.success("Interview rescheduled successfully");
      onClose();
    } catch (error) {
      console.error("Rescheduling failed:", error);
      toast.error("Failed to reschedule interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterPastDates = (date: Date) => {
    const today = startOfDay(new Date());
    const original = parse(request.date, "dd/MM/yyyy", new Date());
    return (
      isAfter(date, today) || isEqual(date, today) || isEqual(date, original)
    );
  };

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
        className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Reschedule Interview
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  Select New Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  minDate={startOfDay(new Date())}
                  filterDate={filterPastDates}
                  placeholderText="DD/MM/YYYY"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
                  dateFormat="dd/MM/yyyy" // Changed to dd/MM/yyyy
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  New Time Slot
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={timeRange.start}
                    onChange={(e) =>
                      setTimeRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
                  />
                  <input
                    type="time"
                    value={timeRange.end}
                    min={timeRange.start}
                    onChange={(e) =>
                      setTimeRange((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-full">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                  Original Schedule
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600">
                  <p className="flex items-center gap-2 bg-white p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">
                      {request.date ? request.date : "Not scheduled"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 bg-white p-2 rounded-lg">
                    <Clock city="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span className="truncate">
                      {request.time ? request.time : "Not scheduled"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleReschedule}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(RescheduleModal);
