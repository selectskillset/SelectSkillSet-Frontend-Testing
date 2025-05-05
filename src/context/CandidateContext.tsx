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
  _id?: string;
  firstName: string;
  lastName: string;
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
  updateProfile: (
    updatedData: FormData | Partial<CandidateProfile>
  ) => Promise<CandidateProfile>;
  rescheduleInterview: (
    id: string,
    updateData: RescheduleData
  ) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CandidateContext = createContext<CandidateContextType | null>(null);

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
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

  // Response interceptor for handling 401 errors
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

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [navigate]);

  const handleApiRequest = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      loadingKey: keyof CandidateState["loading"]
    ) => {
      const token = sessionStorage.getItem("candidateToken");
      if (!token) {
        navigate("/candidate-login");
        throw new Error("No authentication token found");
      }

      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [loadingKey]: true },
        error: null,
      }));

      try {
        return await apiCall();
      } catch (error: any) {
        console.error(`API Error (${loadingKey}):`, error);

        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        setState((prev) => ({ ...prev, error: errorMessage }));

        if (error.response?.status === 401) {
          sessionStorage.removeItem("candidateToken");
          navigate("/candidate-login");
        }
        throw error;
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
    return handleApiRequest(async () => {
      const now = Date.now();
      if (
        state.profile?.lastUpdated &&
        now - state.profile.lastUpdated < CACHE_DURATION
      ) {
        return;
      }

      const { data } = await axiosInstance.get("/candidate/getProfile");
      const profileData = data?.profile || {};

      const updatedProfile = {
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        skills: profileData.skills || [],
        location: profileData.location || "",
        phoneNumber: profileData.phoneNumber || "",
        jobTitle: profileData.jobTitle || "",
        profilePhoto: profileData.profilePhoto || "",
        experiences: profileData.experiences || [],
        linkedIn: profileData.linkedIn || "",
        resume: profileData.resume || "",
        feedback: profileData.statistics?.feedbacks || [],
        lastUpdated: now,
      };

      setState((prev) => ({ ...prev, profile: updatedProfile }));
      return updatedProfile;
    }, "profile");
  }, [handleApiRequest, state.profile?.lastUpdated]);

  const updateProfile = useCallback(
    async (updatedData: FormData | Partial<CandidateProfile>) => {
      return handleApiRequest(async () => {
        const isFormData = updatedData instanceof FormData;
        const config = isFormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : {};

        const { data } = await axiosInstance.put(
          "/candidate/updateProfile",
          updatedData,
          config
        );

        if (data.success) {
          const updatedProfile = { ...state.profile, ...data.profile };
          setState((prev) => ({
            ...prev,
            profile: updatedProfile as CandidateProfile,
          }));
          return updatedProfile;
        }
        throw new Error(data.message || "Profile update failed");
      }, "profile");
    },
    [handleApiRequest, state.profile]
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
