import {
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
  countryCode: string;
  jobTitle: string;
  profilePhoto: string;
  experiences: Experience[];
  linkedIn: string;
  resume: string;
  feedback: Feedback[];
}

interface CompletionData {
  completed: boolean;
  completionPercentage: number;
  missingFields: string[];
}

interface CandidateState {
  profile: CandidateProfile | null;
  completion: CompletionData | null;
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
  fetchProfile: (force?: boolean) => Promise<void>;
  fetchInterviews: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchInterviewers: () => Promise<void>;
  updateProfile: (
    updatedData: Partial<CandidateProfile | FormData>
  ) => Promise<void>;
  rescheduleInterview: (
    id: string,
    updateData: RescheduleData
  ) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000;
const CandidateContext = createContext<CandidateContextType | null>(null);

export const CandidateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const lastFetchedRef = useRef<number>(0);
  const [state, setState] = useState<CandidateState>({
    profile: null,
    completion: null,
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
      (error) => {
        if (error.response?.status === 401) {
          sessionStorage.removeItem("candidateToken");
          // navigate("/candidate-login");
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
      if (!token) return;

      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [loadingKey]: true },
        error: null,
      }));

      try {
        await apiCall();
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
    [navigate]
  );

  const fetchProfile = useCallback(
    async (force = false) => {
      await handleApiRequest(async () => {
        const token = sessionStorage.getItem("candidateToken");
        if (!token) return;

        if (!force && Date.now() - lastFetchedRef.current < CACHE_DURATION)
          return;

        const [profileResponse, completionResponse] = await Promise.all([
          axiosInstance.get("/candidate/getProfile"),
          axiosInstance.get("/candidate/profile-completion"),
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
            skills: profileData.skills || [],
            location: profileData.location,
            phoneNumber: profileData.phoneNumber,
            countryCode: profileData.countryCode,
            jobTitle: profileData.jobTitle,
            profilePhoto: profileData.profilePhoto,
            experiences: profileData.experiences || [],
            linkedIn: profileData.linkedIn,
            resume: profileData.resume,
            feedback: profileData.statistics?.feedbacks || [],
          },
          completion: completionData,
        }));
      }, "profile");
    },
    [handleApiRequest]
  );

  const updateProfile = useCallback(
    async (updatedData: Partial<CandidateProfile | FormData>) => {
      await handleApiRequest(async () => {
        const formData =
          updatedData instanceof FormData ? updatedData : new FormData();

        if (!(updatedData instanceof FormData)) {
          Object.entries(updatedData).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, String(value));
          });
        }

        await axiosInstance.put("/candidate/updateProfile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        lastFetchedRef.current = 0;
        await fetchProfile(true);
      }, "profile");
    },
    [handleApiRequest, fetchProfile]
  );

  const fetchInterviews = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get("/candidate/myInterviews");
      setState((prev) => ({ ...prev, interviews: data.interviews }));
    }, "interviews");
  }, [handleApiRequest]);

  const rescheduleInterview = useCallback(
    async (id: string, updateData: RescheduleData) => {
      await handleApiRequest(async () => {
        const { data } = await axiosInstance.put(
          `/candidate/rescheduleInterviewRequest/${id}`,
          updateData
        );
        setState((prev) => ({
          ...prev,
          interviews: prev.interviews.map((i) =>
            i.id === id ? data.interview : i
          ),
        }));
      }, "interviews");
    },
    [handleApiRequest]
  );

  const fetchStatistics = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get(
        "/candidate/get-candidate-statistics"
      );
      setState((prev) => ({ ...prev, statistics: data.statistics }));
    }, "statistics");
  }, [handleApiRequest]);

  const fetchInterviewers = useCallback(async () => {
    await handleApiRequest(async () => {
      const { data } = await axiosInstance.get("/candidate/interviewers");
      setState((prev) => ({ ...prev, interviewers: data.data }));
    }, "interviewers");
  }, [handleApiRequest]);

  useEffect(() => {
    const token = sessionStorage.getItem("candidateToken");
    if (token) fetchProfile();
  }, [fetchProfile]);

  const value = useMemo(
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
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidate = () => {
  const context = useContext(CandidateContext);
  if (!context)
    throw new Error("useCandidate must be used within CandidateProvider");
  return context;
};
