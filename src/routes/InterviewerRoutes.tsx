import { Routes, Route } from "react-router-dom";
import InterviewerDashboard from "../dashboards/InterviewerDashboard/InterviewerDashboard";
import EditInterviewerProfile from "../dashboards/InterviewerDashboard/EditInterviewerProfile";
import InterviewEvaluationForm from "../dashboards/InterviewerDashboard/InterviewEvaluationForm";
import InterviewAvailability from "../dashboards/InterviewerDashboard/InterviewAvailability";
import InterviewRequests from "../dashboards/InterviewerDashboard/InterviewRequests";
import { InterviewerProvider } from "../context/InterviewerContext";
import InterviewerSettingsPage from "../dashboards/InterviewerDashboard/setting/InterviewerSettingsPage";

// InterviewerRoutes component that defines routes specific to the interviewer's dashboard
const InterviewerRoutes = () => {
  return (
    <InterviewerProvider>
      <Routes>
        {/* Route for interviewer's main dashboard page */}
        <Route
          path="/interviewer-dashboard"
          element={<InterviewerDashboard />}
        />
        <Route
          path="/interviewer-availability"
          element={<InterviewAvailability />}
        />
        <Route path="/interviewer-requests" element={<InterviewRequests />} />

        {/* Route for editing the interviewer's profile */}
        <Route
          path="/edit-interviewer-profile"
          element={<EditInterviewerProfile />}
        />

        {/* Dynamic route for the interviewer's feedback/evaluation form based on candidate and interview request details */}
        <Route
          path="/interviewer-feedback/:candidateId/:interviewRequestId"
          element={<InterviewEvaluationForm />}
        />
        <Route
          path="/interviewer-settings"
          element={<InterviewerSettingsPage />}
        />
      </Routes>
    </InterviewerProvider>
  );
};

export default InterviewerRoutes;
