import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../components/common/axiosConfig";

interface AdminContextType {
  data: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/getAll-details");
      if (response.data.message === "Details fetched successfully") {
        setData(response.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </AdminContext.Provider>
  );
};
