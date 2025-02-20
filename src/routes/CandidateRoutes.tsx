import { Routes, Route } from "react-router-dom";
import CandidateDashboard from "../dashboards/candidateDashboard/CandidateDashboard";
import EditCandidateProfile from "../dashboards/candidateDashboard/EditCandidateProfile";
import CandidateEvaluationForm from "../dashboards/candidateDashboard/CandidateEvaluationForm";
import CandidateSettingsPage from "../dashboards/candidateDashboard/setting/CandidateSettingsPage";
import CandidateInterviews from "../dashboards/candidateDashboard/CandidateInterviews";
import { CandidateProvider } from "../context/CandidateContext";
import CandidateUpcomingInterviews from "../dashboards/candidateDashboard/CandidateUpcomingInterviews";

// CandidateRoutes component that defines routes specific to the candidate's dashboard
const CandidateRoutes = () => {
  return (
    <CandidateProvider>
      <Routes>
        {/* Route for candidate's main dashboard page */}
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />

        {/* Route for editing the candidate's profile */}
        <Route
          path="/edit-candidate-profile"
          element={<EditCandidateProfile />}
        />

        {/* Dynamic route for the candidate's evaluation form based on interview  */}
        <Route
          path="/candidate-feedback/:interviewerId/:interviewRequestId"
          element={<CandidateEvaluationForm />}
        />
        <Route path="/candidate-settings" element={<CandidateSettingsPage />} />
        <Route path="/candidate-interviews" element={<CandidateUpcomingInterviews />} />
        <Route
          path="/candidate-schedule-interviews"
          element={<CandidateInterviews />}
        />
      </Routes>
    </CandidateProvider>
  );
};

export default CandidateRoutes;
