import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import axiosInstance from "../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

type ApiError = {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
  message?: string;
};

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

interface ProfileCompletion {
  totalPercentage: number;
  isComplete: boolean;
  missingSections: { section: string; percentage: number }[];
}

interface InterviewerProfile {
  name: string;
  email: string;
  location: string;
  phoneNumber: string;
  countryCode: string;
  summary: string;
  jobTitle: string;
  profilePhoto: string;
  isVerified: boolean;
  skills: string[];
  experiences: any[];
  price: number;
}

interface InterviewerState {
  profile: InterviewerProfile | null;
  completion: ProfileCompletion | null;
  availabilities: Availability[];
  interviewRequests: InterviewRequest[];
  statistics: InterviewerStatistics | null;
  loading: {
    profile: boolean;
    availabilities: boolean;
    interviewRequests: boolean;
    statistics: boolean;
  };
  error: string | null;
}

interface InterviewerContextType extends InterviewerState {
  fetchProfile: (force?: boolean) => Promise<void>;
  fetchAvailabilities: () => Promise<void>;
  fetchInterviewRequests: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  addAvailability: (data: Availability) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
  updateInterviewRequest: (
    id: string,
    status: "Approved" | "Cancelled"
  ) => Promise<void>;
  rescheduleInterviewRequest: (
    id: string,
    updateData: {
      newDate: string;
      isoDate: string;
      from: string;
      to: string;
    }
  ) => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const InterviewerContext = createContext<InterviewerContextType | null>(null);

export const InterviewerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const lastFetchedRef = useRef<number>(0);
  const [state, setState] = useState<InterviewerState>({
    profile: null,
    completion: null,
    availabilities: [],
    interviewRequests: [],
    statistics: null,
    loading: {
      profile: false,
      availabilities: false,
      interviewRequests: false,
      statistics: false,
    },
    error: null,
  });

  // Add response interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          sessionStorage.removeItem("interviewerToken");
          // navigate("/interviewer-login");
        }
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [navigate]);

  const handleApiRequest = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      loadingKey: keyof InterviewerState["loading"]
    ) => {
      const token = sessionStorage.getItem("interviewerToken");
      if (!token) return;

      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [loadingKey]: true },
        error: null,
      }));

      try {
        return await apiCall();
      } catch (err) {
        const error = err as ApiError;
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw error;
      } finally {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, [loadingKey]: false },
        }));
      }
    },
    []
  );

  const fetchProfile = useCallback(
    async (force = false) => {
      await handleApiRequest(async () => {
        if (!force && Date.now() - lastFetchedRef.current < CACHE_DURATION)
          return;

        const [profileResponse, completionResponse] = await Promise.all([
          axiosInstance.get("/interviewer/getProfile"),
          axiosInstance.get("/interviewer/profile-completion"),
        ]);

        lastFetchedRef.current = Date.now();

        const profileData = profileResponse.data.profile;
        const completionData = completionResponse.data;

        setState((prev) => ({
          ...prev,
          profile: {
            name: `${profileData.firstName || ""} ${
              profileData.lastName || ""
            }`.trim(),
            email: profileData.email,
            location: profileData.location || "Location not provided",
            phoneNumber: profileData.phoneNumber || "Phone number not provided",
            countryCode: profileData.countryCode || "Country code not provided",
            summary: profileData.summary || "",
            jobTitle: profileData.jobTitle || "Job title not provided",
            profilePhoto: profileData.profilePhoto || "",
            isVerified: profileData.isVerified || false,
            skills: profileData.skills || [],
            experiences: profileData.experiences || [],
            price: profileData.price || 0,
          },
          completion: completionData,
        }));
      }, "profile");
    },
    [handleApiRequest]
  );

  const updateProfile = useCallback(
    async (formData: FormData) => {
      await handleApiRequest(async () => {
        await axiosInstance.put("/interviewer/updateProfile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        lastFetchedRef.current = 0; // Invalidate cache
        await fetchProfile(true);
      }, "profile");
    },
    [handleApiRequest, fetchProfile]
  );

  const fetchAvailabilities = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get("/interviewer/getAvailability");
      setState((prev) => ({
        ...prev,
        availabilities: data.availability || [],
      }));
    }, "availabilities");
  }, [handleApiRequest]);

  const addAvailability = useCallback(
    async (newAvailability: Availability) => {
      await handleApiRequest(async () => {
        const { data } = await axiosInstance.post(
          "/interviewer/addAvailability",
          {
            dates: [newAvailability],
          }
        );
        if (data?.success) await fetchAvailabilities();
      }, "availabilities");
    },
    [handleApiRequest, fetchAvailabilities]
  );

  const deleteAvailability = useCallback(
    async (id: string) => {
      await handleApiRequest(async () => {
        const { data } = await axiosInstance.delete(
          "/interviewer/deleteAvailability",
          {
            data: { id },
          }
        );
        if (data?.success) {
          setState((prev) => ({
            ...prev,
            availabilities: prev.availabilities.filter((a) => a._id !== id),
          }));
        }
      }, "availabilities");
    },
    [handleApiRequest]
  );

  const fetchInterviewRequests = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get(
        "/interviewer/getInterviewRequests"
      );
      setState((prev) => ({
        ...prev,
        interviewRequests: data.interviewRequests || [],
      }));
    }, "interviewRequests");
  }, [handleApiRequest]);

  const updateInterviewRequest = useCallback(
    async (id: string, status: "Approved" | "Cancelled") => {
      await handleApiRequest(async () => {
        const { data } = await axiosInstance.put(
          "/interviewer/updateInterviewRequest",
          {
            interviewRequestId: id,
            status,
          }
        );
        if (data?.success) {
          setState((prev) => ({
            ...prev,
            interviewRequests: prev.interviewRequests.map((request) =>
              request.id === id ? { ...request, status } : request
            ),
          }));
        }
      }, "interviewRequests");
    },
    [handleApiRequest]
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
      await handleApiRequest(async () => {
        const { data } = await axiosInstance.put(
          "/interviewer/rescheduleInterviewRequest",
          {
            interviewRequestId: id,
            ...updateData,
          }
        );

        if (data?.success) {
          setState((prev) => ({
            ...prev,
            interviewRequests: prev.interviewRequests.map((request) =>
              request.id === id
                ? {
                    ...request,
                    date: updateData.newDate,
                    time: `${updateData.from} - ${updateData.to}`,
                    status: "RescheduleRequested",
                  }
                : request
            ),
          }));
        }
        return data;
      }, "interviewRequests");
    },
    [handleApiRequest]
  );

  const fetchStatistics = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get(
        "/interviewer/get-interviewer-statistics"
      );
      setState((prev) => ({ ...prev, statistics: data.statistics || null }));
    }, "statistics");
  }, [handleApiRequest]);

  // Initial data fetch
  useEffect(() => {
    const token = sessionStorage.getItem("interviewerToken");
    if (token) {
      const initializeData = async () => {
        try {
          await Promise.all([
            fetchProfile(),
            fetchStatistics(),
            fetchInterviewRequests(),
            fetchAvailabilities(),
          ]);
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      };
      initializeData();
    }
  }, [
    fetchProfile,
    fetchStatistics,
    fetchInterviewRequests,
    fetchAvailabilities,
  ]);

  const value = useMemo(
    () => ({
      ...state,
      fetchProfile,
      fetchAvailabilities,
      addAvailability,
      deleteAvailability,
      fetchInterviewRequests,
      updateInterviewRequest,
      rescheduleInterviewRequest,
      fetchStatistics,
      updateProfile,
    }),
    [
      state,
      fetchProfile,
      fetchAvailabilities,
      addAvailability,
      deleteAvailability,
      fetchInterviewRequests,
      updateInterviewRequest,
      rescheduleInterviewRequest,
      fetchStatistics,
      updateProfile,
    ]
  );

  return (
    <InterviewerContext.Provider value={value}>
      {children}
    </InterviewerContext.Provider>
  );
};

export const useInterviewer = () => {
  const context = useContext(InterviewerContext);
  if (!context) {
    throw new Error(
      "useInterviewer must be used within an InterviewerProvider"
    );
  }
  return context;
};
