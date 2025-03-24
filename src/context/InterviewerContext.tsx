// InterviewerContext.tsx
import React, { createContext, useState, useCallback, useEffect } from "react";
import axiosInstance from "../components/common/axiosConfig";

interface Availability {
  date: string;
  from: string;
  to: string;
  _id: string;
}

interface InterviewRequest {
  id: string;
  name: string;
  profilePhoto: string | null;
  position: string;
  date: string;
  day: string;
  time: string;
  status: string;
}

interface Profile {
  name: string;
  email: string;
  location: string;
  phoneNumber: string;
  jobTitle: string;
  profilePhoto: string;
  isVerified: boolean;
  skills: string[];
  interviewRequests: InterviewRequest[];
  completedInterviews: number;
  pendingRequests: number;
  totalAccepted: number;
  averageRating: number;
  feedbacks: any[];
  experiences: any[];
  availability: Availability[];
}

interface Feedback {
  feedbackData: Record<string, { rating: number; comments: string }>;
  rating: number;
  interviewRequestId: string;
  interviewDate: string;
  candidateName: string;
  profilePhoto: string;
}

interface InterviewerStatistics {
  completedInterviews: number;
  pendingRequests: number;
  totalAccepted: number;
  averageRating: number;
  totalFeedbackCount: number;
  feedbacks: Feedback[];
}

interface InterviewerContextType {
  availabilities: Availability[];
  fetchAvailabilities: () => Promise<void>;
  addAvailability: (data: Availability) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
  interviewRequests: InterviewRequest[];
  fetchInterviewRequests: () => Promise<void>;
  updateInterviewRequest: (
    id: string,
    status: "Approved" | "Cancelled"
  ) => Promise<void>;
  profile: Profile | null;
  fetchProfile: () => Promise<void>;
  statistics: InterviewerStatistics | null;
  fetchStatistics: () => Promise<void>;
  rescheduleInterviewRequest: (
    id: string,
    newDate: string,
    newTime: string
  ) => Promise<void>;
}

export const InterviewerContext = createContext<InterviewerContextType | null>(
  null
);

export const InterviewerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [interviewRequests, setInterviewRequests] = useState<
    InterviewRequest[]
  >([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [statistics, setStatistics] = useState<InterviewerStatistics | null>(
    null
  );

  // Availability functions
  const fetchAvailabilities = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/interviewer/getAvailability");
      if (data?.success) setAvailabilities(data.availability || []);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  }, []);

  const addAvailability = useCallback(
    async (newAvailability: Availability) => {
      try {
        const { data } = await axiosInstance.post(
          "/interviewer/addAvailability",
          {
            dates: [newAvailability],
          }
        );
        if (data?.success) await fetchAvailabilities();
      } catch (error) {
        console.error("Error adding availability:", error);
        throw error;
      }
    },
    [fetchAvailabilities]
  );

  const deleteAvailability = useCallback(async (id: string) => {
    try {
      const { data } = await axiosInstance.delete(
        "/interviewer/deleteAvailability",
        { data: { id } }
      );
      if (data?.success)
        setAvailabilities((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting availability:", error);
      throw error;
    }
  }, []);

  // Interview Requests functions
  const fetchInterviewRequests = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        "/interviewer/getInterviewRequests"
      );
      if (data?.success) setInterviewRequests(data.interviewRequests || []);
    } catch (error) {
      console.error("Error fetching interview requests:", error);
    }
  }, []);

  const updateInterviewRequest = useCallback(
    async (id: string, status: "Approved" | "Cancelled") => {
      try {
        const { data } = await axiosInstance.put(
          "/interviewer/updateInterviewRequest",
          {
            interviewRequestId: id,
            status,
          }
        );
        if (data?.success) {
          setInterviewRequests((prev) =>
            prev.map((request) =>
              request.id === id ? { ...request, status } : request
            )
          );
        }
      } catch (error) {
        console.error("Error updating interview request:", error);
        throw error;
      }
    },
    []
  );

  const rescheduleInterviewRequest = useCallback(
    async (
      id: string,
      updateData: {
        newDate: string;
        isoDate: string;
        from: string;
        to: string;
      }
    ) => {
      try {
        const { data } = await axiosInstance.put(
          "/interviewer/rescheduleInterviewRequest",
          {
            interviewRequestId: id,
            newDate: updateData.newDate,
            from: updateData.from,
            to: updateData.to,
            // Only include isoDate if your backend actually needs it
            isoDate: updateData.isoDate,
          }
        );

        if (data?.success) {
          setInterviewRequests((prev) =>
            prev.map((request) =>
              request.id === id
                ? {
                    ...request,
                    date: updateData.newDate,
                    time: `${updateData.from} - ${updateData.to}`,
                    status: "RescheduleRequested",
                    isoDate: updateData.isoDate,
                  }
                : request
            )
          );
        }
        return data;
      } catch (error) {
        console.error("Error rescheduling interview:", error);
        throw error;
      }
    },
    []
  );
  // Profile functions
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/interviewer/getProfile");
      if (data?.success) {
        const profileData = data.profile;
        setProfile({
          name: `${profileData.firstName || ""} ${
            profileData.lastName || ""
          }`.trim(),
          email: profileData.email,
          location: profileData.location || "Location not provided",
          phoneNumber: profileData.phoneNumber || "Phone number not provided",
          jobTitle: profileData.jobTitle || "Job title not provided",
          profilePhoto: profileData.profilePhoto || "",
          isVerified: profileData.isVerified || false,
          experiences: profileData.experiences || [],
          skills: profileData.skills || [],
          interviewRequests: profileData.interviewRequests || [],
          completedInterviews: profileData.statistics?.completedInterviews || 0,
          pendingRequests: profileData.statistics?.pendingRequests || 0,
          totalAccepted: profileData.statistics?.totalAccepted || 0,
          averageRating: profileData.statistics?.averageRating || 0,
          feedbacks: profileData.feedbacks || [],
          availability: profileData.availability || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  // Statistics functions
  const fetchStatistics = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        "/interviewer/get-interviewer-statistics"
      );
      setStatistics(data?.statistics || null);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics(null);
    }
  }, []);

  // Initial data fetch
  // useEffect(() => {
  //   const initializeData = async () => {
  //     await Promise.all([
  //       fetchAvailabilities(),
  //       fetchInterviewRequests(),
  //       fetchProfile(),
  //       fetchStatistics(),
  //     ]);
  //   };
  //   initializeData();
  // }, [
  //   fetchAvailabilities,
  //   fetchInterviewRequests,
  //   fetchProfile,
  //   fetchStatistics,
  // ]);

  return (
    <InterviewerContext.Provider
      value={{
        availabilities,
        fetchAvailabilities,
        addAvailability,
        deleteAvailability,
        interviewRequests,
        fetchInterviewRequests,
        updateInterviewRequest,
        profile,
        fetchProfile,
        statistics,
        fetchStatistics,
        rescheduleInterviewRequest,
      }}
    >
      {children}
    </InterviewerContext.Provider>
  );
};
