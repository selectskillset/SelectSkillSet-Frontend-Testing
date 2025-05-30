import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminProvider } from "../context/AdminContext";
import Loader from "../components/ui/Loader";
import AdminLayout from "../dashboards/adminDashboard/AdminLayout";
import AdminLogin from "../dashboards/adminDashboard/AdminLogin";
import AdminDashboard from "../dashboards/adminDashboard/AdminDashboard";
import AdminProfiles from "../dashboards/adminDashboard/AdminProfiles";
import CandidateDetailsPage from "../dashboards/adminDashboard/CandidateDetailsPage";
import InterviewerDetailsPage from "../dashboards/adminDashboard/InterviewerDetailsPage";
import CorporateDetailsPage from "../dashboards/adminDashboard/CorporateDetailsPage";
import AdminSettingsPage from "../dashboards/adminDashboard/setting/AdminSettingsPage";
import TablePage from "../dashboards/adminDashboard/TablePage";



const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminProvider>
            <AdminLayout>
              <Suspense fallback={<Loader fullScreen />}>
                <Routes>
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/profiles" element={<AdminProfiles />} />
                  <Route path="/candidates/:id" element={<CandidateDetailsPage />} />
                  <Route path="/interviewers/:id" element={<InterviewerDetailsPage />} />
                  <Route path="/corporates/:id" element={<CorporateDetailsPage />} />
                  <Route path="/table" element={<TablePage />} />
                  <Route path="/settings" element={<AdminSettingsPage />} />
                </Routes>
              </Suspense>
            </AdminLayout>
          </AdminProvider>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;