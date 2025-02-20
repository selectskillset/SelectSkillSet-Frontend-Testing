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
  status: string;
}

interface Profile {
  name: string;
  email: string;
  location: string;
  phoneNumber: string;
  jobTitle: string;
  profilePhoto: string;
  skills: string[];
  interviewRequests: any[];
  completedInterviews: number;
  pendingRequests: number;
  totalAccepted: number;
  averageRating: number;
  feedbacks: any[];
  availability: any[];
}

interface Feedback {
  feedbackData: Record<string, { rating: number; comments: string }>;
  rating: number;
  interviewRequestId: string;
  interviewDate: string;
  candidateName: string;
  profilePhoto: string;
}

interface InterviewerStatisticsType {
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
  addAvailability: (data: {
    date: string;
    from: string;
    to: string;
  }) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;

  // Interview Requests
  interviewRequests: InterviewRequest[];
  fetchInterviewRequests: () => Promise<void>;
  updateInterviewRequest: (
    id: string,
    status: "Approved" | "Cancelled"
  ) => Promise<void>;

  // Profile
  profile: Profile | null;
  fetchProfile: () => Promise<void>;

  statistics: InterviewerStatisticsType | null;
  fetchStatistics: () => Promise<void>;
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
  const [statistics, setStatistics] =
    useState<InterviewerStatisticsType | null>(null);

  // Fetch availabilities
  const fetchAvailabilities = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/interviewer/getAvailability");
      if (response.data?.success) {
        setAvailabilities(response.data.availability || []);
      }
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  }, []);

  // Add availability
  const addAvailability = useCallback(
    async (data: { date: string; from: string; to: string }) => {
      try {
        const response = await axiosInstance.post(
          "/interviewer/addAvailability",
          {
            dates: [data],
          }
        );
        if (response.data?.success) {
          await fetchAvailabilities();
        }
      } catch (error) {
        console.error("Error adding availability:", error);
      }
    },
    [fetchAvailabilities]
  );

  // Delete availability
  const deleteAvailability = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.delete(
        "/interviewer/deleteAvailability",
        {
          data: { id },
        }
      );
      if (response.data?.success) {
        setAvailabilities((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  }, []);

  // Fetch interview requests
  const fetchInterviewRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        "/interviewer/getInterviewRequests"
      );
      if (response.data?.success) {
        setInterviewRequests(response.data.interviewRequests || []);
      }
    } catch (error) {
      console.error("Error fetching interview requests:", error);
    }
  }, []);

  // Update interview request status
  const updateInterviewRequest = useCallback(
    async (id: string, status: "Approved" | "Cancelled") => {
      try {
        const payload = { interviewRequestId: id, status };
        const response = await axiosInstance.put(
          "/interviewer/updateInterviewRequest",
          payload
        );
        if (response.data?.success) {
          setInterviewRequests((prev) =>
            prev.map((request) =>
              request.id === id ? { ...request, status } : request
            )
          );
        }
      } catch (error) {
        console.error("Error updating interview request:", error);
      }
    },
    []
  );

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/interviewer/getProfile");
      if (response.data?.success) {
        const profileData = response.data.profile;
        setProfile({
          name: `${profileData.firstName || ""} ${
            profileData.lastName || ""
          }`.trim(),
          email: profileData.email,
          location: profileData.location || "Location not provided",
          phoneNumber: profileData.phoneNumber || "Phone number not provided",
          jobTitle: profileData.jobTitle || "Job title not provided",
          profilePhoto: profileData.profilePhoto || "",
          skills: profileData.skills || [],
          interviewRequests: profileData.interviewRequests || [],
          completedInterviews: profileData.statistics.completedInterviews || 0,
          pendingRequests: profileData.statistics.pendingRequests || 0,
          totalAccepted: profileData.statistics.totalAccepted || 0,
          averageRating: profileData.statistics.averageRating || 0,
          feedbacks: profileData.feedbacks || [],
          availability: profileData.availability || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  // Fetch interviewer statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        "/interviewer/get-interviewer-statistics"
      );
      if (response.data && response.data.statistics) {
        setStatistics(response.data.statistics);
      } else {
        setStatistics(null);
      }
    } catch (error) {
      console.error("Error fetching interviewer statistics:", error);
      setStatistics(null);
    }
  },[])

 

  // Fetch data on mount
  // useEffect(() => {
  //   fetchProfile();
  //   fetchAvailabilities();
  //   fetchInterviewRequests();
  //   fetchStatistics();
  // }, [fetchProfile, fetchAvailabilities, fetchInterviewRequests]);

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
      }}
    >
      {children}
    </InterviewerContext.Provider>
  );
};
