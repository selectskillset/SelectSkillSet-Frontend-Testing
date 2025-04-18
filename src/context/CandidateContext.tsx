import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import axiosInstance from "../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

// Type Definitions
type ApiError = {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
  message?: string;
};

type RescheduleData = {
  newDate: string;
  isoDate: string;
  from: string;
  to: string;
};

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  employmentType: string;
}

interface Feedback {
  feedbackData: Record<string, unknown>;
  rating: number;
  interviewRequestId: string;
  interviewDate: string;
  interviewer: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}

interface Statistics {
  completedInterviews: number;
  averageRating: number;
  totalFeedbackCount: number;
  feedbacks: Feedback[];
}

interface Interview {
  id: string;
  name: string;
  date: string;
  time: string;
  status: string;
  interviewer?: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
  position?: string;
}

interface CandidateProfile {
  name: string;
  email: string;
  skills: string[];
  location: string;
  phoneNumber: string;
  jobTitle: string;
  profilePhoto: string;
  experiences: Experience[];
  linkedIn: string;
  resume: string;
  feedback: Feedback[];
  lastUpdated?: number;
}

interface CandidateState {
  profile: CandidateProfile | null;
  interviews: Interview[];
  statistics: Statistics | null;
  interviewers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
    specialization: string[];
  }>;
  loading: {
    profile: boolean;
    interviews: boolean;
    statistics: boolean;
    interviewers: boolean;
  };
  error: string | null;
}

interface CandidateContextType extends CandidateState {
  fetchProfile: () => Promise<void>;
  fetchInterviews: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchInterviewers: () => Promise<void>;
  updateProfile: (updatedData: Partial<CandidateProfile>) => Promise<void>;
  rescheduleInterview: (id: string, updateData: RescheduleData) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const CandidateContext = createContext<CandidateContextType | null>(null);

export const CandidateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<CandidateState>({
    profile: null,
    interviews: [],
    statistics: null,
    interviewers: [],
    loading: {
      profile: false,
      interviews: false,
      statistics: false,
      interviewers: false,
    },
    error: null,
  });

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          sessionStorage.removeItem("candidateToken");
          navigate("/candidate-login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const handleApiRequest = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      loadingKey: keyof CandidateState["loading"],
      retryCount = 0
    ) => {
      const token = sessionStorage.getItem("candidateToken");
      if (!token) {
        navigate("/candidate-login");
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [loadingKey]: true },
        error: null,
      }));

      try {
        await apiCall();
      } catch (err: unknown) {
        const error = err as ApiError;
        console.error(`API Error (${loadingKey}):`, error);

        if (retryCount < 3 && !error.response) {
          return handleApiRequest(apiCall, loadingKey, retryCount + 1);
        }

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An error occurred, please try again later";

        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));

        if (error.response?.status === 401) {
          sessionStorage.removeItem("candidateToken");
          navigate("/candidate-login");
        }
      } finally {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, [loadingKey]: false },
        }));
      }
    },
    [navigate]
  );

  const fetchProfile = useCallback(async () => {
    await handleApiRequest(async () => {
      const now = Date.now();
      if (
        state.profile?.lastUpdated &&
        now - state.profile.lastUpdated < CACHE_DURATION
      ) {
        return;
      }

      const response = await axiosInstance.get("/candidate/getProfile");
      const profileData = response.data?.profile || {};

      setState((prev) => ({
        ...prev,
        profile: {
          name: `${profileData.firstName || ""} ${
            profileData.lastName || ""
          }`.trim(),
          email: profileData.email || "Email not provided",
          skills: profileData.skills || [],
          location: profileData.location || "Location not provided",
          phoneNumber: profileData.phoneNumber || "Phone number not provided",
          jobTitle: profileData.jobTitle || "Job title not provided",
          profilePhoto: profileData.profilePhoto || "",
          experiences: profileData.experiences || [],
          linkedIn: profileData.linkedIn || "",
          resume: profileData.resume || "",
          feedback: profileData.statistics?.feedbacks || [],
          lastUpdated: now,
        },
      }));
    }, "profile");
  }, [handleApiRequest, state.profile]);

  const updateProfile = useCallback(
    async (updatedData: Partial<CandidateProfile>) => {
      await handleApiRequest(async () => {
        const response = await axiosInstance.put(
          "/candidate/updateProfile",
          updatedData
        );

        if (response.data.success) {
          setState((prev) => ({
            ...prev,
            profile: prev.profile
              ? {
                  ...prev.profile,
                  ...updatedData,
                  lastUpdated: Date.now(),
                }
              : null,
          }));
        }
      }, "profile");
    },
    [handleApiRequest]
  );

  const fetchInterviews = useCallback(async () => {
    await handleApiRequest(async () => {
      const response = await axiosInstance.get("/candidate/myInterviews");
      setState((prev) => ({
        ...prev,
        interviews: response.data.interviews || [],
      }));
    }, "interviews");
  }, [handleApiRequest]);

  const rescheduleInterview = useCallback(
    async (id: string, updateData: RescheduleData) => {
      await handleApiRequest(async () => {
        const { data } = await axiosInstance.put<{
          success: boolean;
          interview: Interview;
        }>("/candidate/rescheduleInterviewRequest", {
          interviewRequestId: id,
          ...updateData,
        });

        if (data.success) {
          setState((prev) => ({
            ...prev,
            interviews: prev.interviews.map((interview) =>
              interview.id === id
                ? {
                    ...interview,
                    date: updateData.newDate,
                    time: `${updateData.from} - ${updateData.to}`,
                    status: "RescheduleRequested",
                  }
                : interview
            ),
          }));
        }
      }, "interviews");
    },
    [handleApiRequest]
  );

  const fetchStatistics = useCallback(async () => {
    await handleApiRequest(async () => {
      const response = await axiosInstance.get(
        "/candidate/get-candidate-statistics"
      );
      setState((prev) => ({
        ...prev,
        statistics: response.data.statistics || null,
      }));
    }, "statistics");
  }, [handleApiRequest]);

  const fetchInterviewers = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get("/candidate/interviewers");
      setState((prev) => ({
        ...prev,
        interviewers: data.interviewers || [],
      }));
    }, "interviewers");
  }, [handleApiRequest]);

  const contextValue = useMemo(
    () => ({
      ...state,
      fetchProfile,
      fetchInterviews,
      fetchStatistics,
      fetchInterviewers,
      updateProfile,
      rescheduleInterview,
    }),
    [
      state,
      fetchProfile,
      fetchInterviews,
      fetchStatistics,
      fetchInterviewers,
      updateProfile,
      rescheduleInterview,
    ]
  );

  return (
    <CandidateContext.Provider value={contextValue}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidate = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error("useCandidate must be used within a CandidateProvider");
  }
  return context;
};
