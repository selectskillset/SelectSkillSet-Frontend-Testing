import { Routes, Route } from "react-router-dom";
import InterviewerDashboard from "../dashboards/InterviewerDashboard/InterviewerDashboard";
import EditInterviewerProfile from "../dashboards/InterviewerDashboard/EditInterviewerProfile";
import InterviewAvailability from "../dashboards/InterviewerDashboard/InterviewAvailability";
import InterviewRequests from "../dashboards/InterviewerDashboard/InterviewRequests";
import { InterviewerProvider } from "../context/InterviewerContext";
import InterviewerSettingsPage from "../dashboards/InterviewerDashboard/setting/InterviewerSettingsPage";
import InterviewerStatistics from "../dashboards/InterviewerDashboard/InterviewerStatistics";
import InterviewerLayout from "../dashboards/InterviewerDashboard/InterviewerLayout";

const InterviewerRoutes = () => {
  return (
    <InterviewerProvider>
      <Routes>
        <Route element={<InterviewerLayout />}>
          <Route
            path="interviewer-dashboard"
            element={<InterviewerDashboard />}
          />
          <Route
            path="interviewer-availability"
            element={<InterviewAvailability />}
          />
          <Route path="interviewer-requests" element={<InterviewRequests />} />
          <Route
            path="interviewer-statistics"
            element={<InterviewerStatistics />}
          />
          <Route
            path="edit-interviewer-profile"
            element={<EditInterviewerProfile />}
          />
        
          <Route
            path="interviewer-settings"
            element={<InterviewerSettingsPage />}
          />
        </Route>
      </Routes>
    </InterviewerProvider>
  );
};

export default InterviewerRoutes;
