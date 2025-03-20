import { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

// Define Feedback Interface
export interface Feedback {
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

// Define Statistics Interface
export interface Statistics {
  completedInterviews: number;
  averageRating: number;
  totalFeedbackCount: number;
  feedbacks: Feedback[];
}

// Define Interview Interface
export interface Interview {
  id: string;
  name: string;
  date: string;
  time: string;
  status: string;
  [key: string]: any; // Allow additional properties
}

// Create Context
const CandidateContext = createContext<any>(null);

// Custom Hook to Use Context
export const useCandidateContext = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error(
      "useCandidateContext must be used within a CandidateProvider"
    );
  }
  return context;
};

// Provider Component
export const CandidateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [interviewers, setInterviewers] = useState<any[]>([]); // New state for interviewers
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(false);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [isLoadingInterviewers, setIsLoadingInterviewers] = useState(false); // New loading flag
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch candidate profile
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      const token = sessionStorage.getItem("candidateToken");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosInstance.get("/candidate/getProfile");

      if (response.data?.success && response.data.profile) {
        const profileData = response.data.profile || {};
        setProfile({
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
        });
      } else {
        setError("Failed to fetch profile data.");
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || "An error occurred while fetching profile.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [navigate]);

  // Fetch candidate interviews
  const fetchInterviews = useCallback(async () => {
    try {
      setIsLoadingInterviews(true);
      const token = sessionStorage.getItem("candidateToken");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosInstance.get("/candidate/myInterviews");
      if (response.data?.success) {
        setInterviews(response.data.interviews || []);
      } else {
        setError("Failed to fetch interviews.");
      }
    } catch (err: any) {
      console.error("Error fetching interviews:", err);
      setError(err.message || "An error occurred while fetching interviews.");
    } finally {
      setIsLoadingInterviews(false);
    }
  }, [navigate]);

  // Fetch candidate statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoadingStatistics(true);
      const token = sessionStorage.getItem("candidateToken");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosInstance.get(
        "/candidate/get-candidate-statistics"
      );
      if (response.data) {
        setStatistics(response.data.statistics || null);
      } else {
        setError("Failed to fetch statistics.");
      }
    } catch (err: any) {
      console.error("Error fetching statistics:", err);
      setError(err.message || "An error occurred while fetching statistics.");
    } finally {
      setIsLoadingStatistics(false);
    }
  }, [navigate]);

  // Fetch interviewers
  const fetchInterviewers = useCallback(async () => {
    try {
      setIsLoadingInterviewers(true);
      const token = sessionStorage.getItem("candidateToken");
      if (!token) {
        navigate("/login");
        return;
      }
      const { data } = await axiosInstance.get("/candidate/interviewers");
      if (data.success) {
        setInterviewers(data.interviewers); // Update interviewers state
      } else {
        setError("Failed to fetch interviewers.");
      }
    } catch (err: any) {
      console.error("Error fetching interviewers:", err);
      setError(err.message || "An error occurred while fetching interviewers.");
    } finally {
      setIsLoadingInterviewers(false);
    }
  }, [navigate]);

  // Update profile data
  const updateProfile = useCallback(async (updatedData: any) => {
    try {
      const response = await axiosInstance.put(
        "/candidate/updateProfile",
        updatedData
      );
      if (response.data.success) {
        setProfile((prevProfile: any) => ({ ...prevProfile, ...updatedData }));
      } else {
        throw new Error(response.data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "An error occurred while updating profile.");
    }
  }, []);

  // Reschedule Interview Function
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
      try {
        setIsLoadingInterviews(true);
        const { data } = await axiosInstance.put<{
          success: boolean;
          interview: Interview;
        }>("/candidate/rescheduleInterviewRequest", {
          interviewRequestId: id,
          ...updateData
        });
  
        if (data.success) {
          setInterviews(prev =>
            prev.map(interview =>
              interview.id === id
                ? {
                    ...interview,
                    date: updateData.newDate,
                    time: `${updateData.from} - ${updateData.to}`,
                    status: "RescheduleRequested"
                  }
                : interview
            )
          );
        }
        return data;
      } catch (error: any) {
        console.error("Error rescheduling interview:", error);
        throw error;
      } finally {
        setIsLoadingInterviews(false);
      }
    },
    []
  );

  return (
    <CandidateContext.Provider
      value={{
        profile,
        isLoadingProfile,
        fetchProfile,
        interviews,
        isLoadingInterviews,
        fetchInterviews,
        statistics,
        isLoadingStatistics,
        fetchStatistics,
        interviewers, // Add interviewers to context
        isLoadingInterviewers, // Add loading flag for interviewers
        fetchInterviewers, // Add fetchInterviewers function
        error,
        updateProfile,
        rescheduleInterview,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};
