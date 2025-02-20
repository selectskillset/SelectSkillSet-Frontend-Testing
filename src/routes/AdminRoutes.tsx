import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../dashboards/adminDashboard/AdminDashboard";
import AdminProfiles from "../dashboards/adminDashboard/AdminProfiles";
import CandidateDetailsPage from "../dashboards/adminDashboard/CandidateDetailsPage";
import InterviewerDetailsPage from "../dashboards/adminDashboard/InterviewerDetailsPage";
import CorporateDetailsPage from "../dashboards/adminDashboard/CorporateDetailsPage";
import TablePage from "../dashboards/adminDashboard/TablePage";
import { AdminProvider } from "../context/AdminContext";
import AdminLogin from "../dashboards/adminDashboard/AdminLogin";

// AdminRoutes component that sets up routes for admin dashboard
const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminProvider>
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/dashboard/profiles" element={<AdminProfiles />} />

              <Route
                path="/candidates/:id"
                element={<CandidateDetailsPage />}
              />
              <Route
                path="/interviewers/:id"
                element={<InterviewerDetailsPage />}
              />
              <Route
                path="/corporates/:id"
                element={<CorporateDetailsPage />}
              />
              <Route path="/dashboard/table" element={<TablePage />} />
            </Routes>
          </AdminProvider>
        }
      />
      {/* Route for admin login page */}
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
};

export default AdminRoutes;
