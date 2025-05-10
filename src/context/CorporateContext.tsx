// src/context/CorporateContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {toast} from "sonner";
import axiosInstance from "../components/common/axiosConfig";

// Interfaces
interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location?: string;
  resume?: string;
  skills: string[];
  profilePhoto?: string;
  linkedIn?: string;
  statistics: { averageRating: number };
}

interface CorporateProfile {
  contactName: string;
  email: string;
  profilePhoto: string;
  phoneNumber: string;
  countryCode: string;
  companyName: string;
  bookmarks: Array<{ candidateId: string }>;
}

interface CorporateContextType {
  profile: CorporateProfile | null;
  candidates: Candidate[];
  totalCandidates: number;
  loading: boolean;
  setProfile: (profile: CorporateProfile | null) => void;
  setCandidates: (candidates: Candidate[]) => void;
  setTotalCandidates: (total: number) => void;
  setLoading: (loading: boolean) => void;
  fetchCandidates: (page: number, limit?: number) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

// Create Context
const CorporateContext = createContext<CorporateContextType | undefined>(
  undefined
);

// Constants
const CANDIDATES_PER_PAGE = 5;

// Provider Component
export const CorporateProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<CorporateProfile | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCandidates, setTotalCandidates] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const hasFetchedInitialData = useRef(false);

  // Fetch Corporate Profile
  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/corporate/getProfile");
      setProfile(response.data?.corporate || null);
    
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile.");
    }
  };

  // Fetch Candidates
  const fetchCandidates = async (
    page: number,
    limit: number = CANDIDATES_PER_PAGE
  ) => {
    try {
      const response = await axiosInstance.get("/corporate/getAllCandidates", {
        params: { page, limit },
      });
      const { candidates: fetchedCandidates, total } = response.data || {};
      setCandidates(fetchedCandidates || []);
      setTotalCandidates(total || 0);
     
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates.");
    }
  };

  // // Fetch Initial Data Only Once
  // useEffect(() => {
  //   if (!hasFetchedInitialData.current) {
  //     const loadInitialData = async () => {
  //       setLoading(true);
  //       try {
  //         await Promise.all([fetchProfile(), fetchCandidates(1)]);
  //         hasFetchedInitialData.current = true;
  //       } catch (error) {
  //         console.error("Error loading initial data:", error);
  //         toast.error("Failed to load initial data.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     loadInitialData();
  //   }
  // }, []); // Empty dependency array ensures this runs only once

  const value = {
    profile,
    candidates,
    totalCandidates,
    loading,
    setProfile,
    setCandidates,
    setTotalCandidates,
    setLoading,
    fetchCandidates,
    fetchProfile,
  };

  return (
    <CorporateContext.Provider value={value}>
      {children}
    </CorporateContext.Provider>
  );
};

// Custom Hook to Use the Context
export const useCorporateContext = () => {
  const context = useContext(CorporateContext);
  if (!context) {
    throw new Error(
      "useCorporateContext must be used within a CorporateProvider"
    );
  }
  return context;
};
