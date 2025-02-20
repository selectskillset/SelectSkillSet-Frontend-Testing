// src/context/CorporateContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
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
  fetchCandidates: (page: number, limit: number) => Promise<void>;
}

// Create Context
const CorporateContext = createContext<CorporateContextType | undefined>(undefined);

// Constants
const CANDIDATES_PER_PAGE = 5;

// Provider Component
export const CorporateProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<CorporateProfile | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCandidates, setTotalCandidates] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/corporate/getProfile");
      setProfile(response.data?.corporate || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile.");
    }
  };

  const fetchCandidates = async (page: number, limit: number = CANDIDATES_PER_PAGE) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/corporate/getAllCandidates", {
        params: { page, limit },
      });
      const { candidates: fetchedCandidates, total } = response.data || {};
      setCandidates(fetchedCandidates || []);
      setTotalCandidates(total || 0);
      toast.success("Candidates fetched successfully!");
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data only once on mount
  useEffect(() => {
    fetchProfile();
    fetchCandidates(1); // Initial fetch for page 1
  }, []); // Empty dependency array ensures it runs only once on mount

  const value = {
    profile,
    candidates,
    totalCandidates,
    loading,
    fetchCandidates,
  };

  return <CorporateContext.Provider value={value}>{children}</CorporateContext.Provider>;
};

// Custom Hook to use the context
export const useCorporateContext = () => {
  const context = useContext(CorporateContext);
  if (!context) {
    throw new Error("useCorporateContext must be used within a CorporateProvider");
  }
  return context;
};