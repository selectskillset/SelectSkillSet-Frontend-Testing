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
interface Feedback {
  feedbackData: Record<string, any>;
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
  [key: string]: any;
}

interface CandidateProfile {
  name: string;
  email: string;
  skills: string[];
  location: string;
  phoneNumber: string;
  jobTitle: string;
  profilePhoto: string;
  experiences: any[];
  linkedIn: string;
  resume: string;
  feedback: Feedback[];
}

interface CandidateState {
  profile: CandidateProfile | null;
  interviews: Interview[];
  statistics: Statistics | null;
  interviewers: any[];
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
  rescheduleInterview: (
    id: string,
    updateData: {
      newDate: string;
      isoDate: string;
      from: string;
      to: string;
    }
  ) => Promise<void>;
}

// Create Context
const CandidateContext = createContext<CandidateContextType | null>(null);

// Provider Component
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
      loadingKey: keyof CandidateState["loading"]
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
      } catch (err: any) {
        console.error(`API Error (${loadingKey}):`, err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred, please try again later";
        
        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        
        if (err.response?.status === 401) {
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
      // Cache check
      if (state.profile) return;

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
        },
      }));
    }, "profile");
  }, [handleApiRequest]);

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
            profile: prev.profile ? { ...prev.profile, ...updatedData } : null,
          }));
        }
      }, "profile");
    },
    [handleApiRequest]
  );

  // Interview Management
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

  // Statistics Management
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

  // Interviewers Management
  const fetchInterviewers = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get("/candidate/interviewers");
      setState((prev) => ({
        ...prev,
        interviewers: data.interviewers || [],
      }));
    }, "interviewers");
  }, [handleApiRequest]);

  const contextValue = useMemo(() => {
    const { profile, interviews, statistics, interviewers, loading, error } = state;
    return {
      profile,
      interviews,
      statistics,
      interviewers,
      loading,
      error,
      fetchProfile,
      fetchInterviews,
      fetchStatistics,
      fetchInterviewers,
      updateProfile,
      rescheduleInterview,
    };
  }, [
    state,
    fetchProfile,
    fetchInterviews,
    fetchStatistics,
    fetchInterviewers,
    updateProfile,
    rescheduleInterview,
  ]);

  return (
    <CandidateContext.Provider value={contextValue}>
      {children}
    </CandidateContext.Provider>
  );
};

// Custom Hook
export const useCandidate = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error("useCandidate must be used within a CandidateProvider");
  }
  return context;
};
