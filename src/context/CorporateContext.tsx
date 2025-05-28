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

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  location?: string;
  resume?: string;
  skills: string[];
  profilePhoto?: string;
  linkedIn?: string;
  statistics: { averageRating: number };
}

interface CorporateProfile {
  _id: string;
  contactName: string;
  email: string;
  profilePhoto: string;
  phoneNumber: string;
  countryCode: string;
  companyName: string;
  bookmarks: Array<{ candidateId: string }>;
  isVerified: boolean;
  website?: string;
  location?: string;
}

interface CorporateState {
  profile: CorporateProfile | null;
  candidates: Candidate[];
  totalCandidates: number;
  loading: {
    profile: boolean;
    candidates: boolean;
  };
  error: string | null;
}

interface CorporateContextType extends CorporateState {
  fetchProfile: (force?: boolean) => Promise<void>;
  fetchCandidates: (page: number, limit?: number) => Promise<void>;
  updateProfile: (data: FormData | Record<string, any>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000;
const CANDIDATES_PER_PAGE = 8;

const CorporateContext = createContext<CorporateContextType | null>(null);

export const CorporateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const lastFetchedRef = useRef<number>(0);
  const [state, setState] = useState<CorporateState>({
    profile: null,
    candidates: [],
    totalCandidates: 0,
    loading: {
      profile: false,
      candidates: false,
    },
    error: null,
  });

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          sessionStorage.removeItem("corporateToken");
          navigate("/corporate-login");
        }
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [navigate]);

  const handleApiRequest = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      loadingKey: keyof CorporateState["loading"]
    ) => {
      const token = sessionStorage.getItem("corporateToken");
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
        const token = sessionStorage.getItem("corporateToken");
        if (!token) return;

        if (!force && Date.now() - lastFetchedRef.current < CACHE_DURATION)
          return;

        const response = await axiosInstance.get("/corporate/getProfile");
        lastFetchedRef.current = Date.now();

        setState((prev) => ({
          ...prev,
          profile: response.data?.corporate || null,
        }));
      }, "profile");
    },
    [handleApiRequest]
  );

  const updateProfile = useCallback(
    async (data: FormData | Record<string, any>) => {
      await handleApiRequest(async () => {
        const formData = data instanceof FormData ? data : new FormData();

        if (!(data instanceof FormData)) {
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, value);
          });
        }

        await axiosInstance.put("/corporate/updateProfile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        lastFetchedRef.current = 0;
        await fetchProfile(true);
      }, "profile");
    },
    [handleApiRequest, fetchProfile]
  );

  const fetchCandidates = useCallback(
    async (page: number, limit: number = CANDIDATES_PER_PAGE) => {
      await handleApiRequest(async () => {
        const { data } = await axiosInstance.get(
          "/corporate/getAllCandidates",
          {
            params: { page, limit },
          }
        );
        setState((prev) => ({
          ...prev,
          candidates: data?.candidates || [],
          totalCandidates: data?.total || 0,
        }));
      }, "candidates");
    },
    [handleApiRequest]
  );

  const refreshProfile = useCallback(async () => {
    await fetchProfile(true);
  }, [fetchProfile]);

  useEffect(() => {
    const token = sessionStorage.getItem("corporateToken");
    if (token) fetchProfile();
  }, [fetchProfile]);

  const value = useMemo(
    () => ({
      ...state,
      fetchProfile,
      fetchCandidates,
      updateProfile,
      refreshProfile,
    }),
    [state, fetchProfile, fetchCandidates, updateProfile, refreshProfile]
  );

  return (
    <CorporateContext.Provider value={value}>
      {children}
    </CorporateContext.Provider>
  );
};

export const useCorporate = () => {
  const context = useContext(CorporateContext);
  if (!context)
    throw new Error("useCorporate must be used within CorporateProvider");
  return context;
};
