import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../dashboards/candidateDashboard/CandidateDashboard";
import EditCandidateProfile from "../dashboards/candidateDashboard/EditCandidateProfile";
import CandidateEvaluationForm from "../dashboards/candidateDashboard/CandidateEvaluationForm";
import CandidateSettingsPage from "../dashboards/candidateDashboard/setting/CandidateSettingsPage";
import CandidateInterviews from "../dashboards/candidateDashboard/CandidateInterviews";
import { CandidateProvider } from "../context/CandidateContext";
import CandidateUpcomingInterviews from "../dashboards/candidateDashboard/CandidateUpcomingInterviews";
import CandidateLayout from "../dashboards/candidateDashboard/CandidateLayout";
import CandidateStatistics from "../dashboards/candidateDashboard/CandidateStatistics";

const CandidateRoutes = () => {
  return (
    <CandidateProvider>
      <Routes>
        <Route element={<CandidateLayout />}>
          <Route path="candidate-dashboard" element={<CandidateDashboard />} />
          <Route
            path="edit-candidate-profile"
            element={<EditCandidateProfile />}
          />
          <Route
            path="candidate-statestics"
            element={<CandidateStatistics />}
          />
          <Route
            path="candidate-interviews"
            element={<CandidateUpcomingInterviews />}
          />
          <Route
            path="candidate-schedule-interviews"
            element={<CandidateInterviews />}
          />
          <Route
            path="candidate-settings"
            element={<CandidateSettingsPage />}
          />
          <Route
            path="candidate-feedback/:interviewerId/:interviewRequestId"
            element={<CandidateEvaluationForm />}
          />
        
        </Route>
      </Routes>
    </CandidateProvider>
  );
};

export default CandidateRoutes;
