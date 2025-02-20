import { Routes, Route } from "react-router-dom";
import CorporateDashboard from "../dashboards/corporateDashboard/CorporateDashboard";
import EditCorporateProfile from "../dashboards/corporateDashboard/EditCorporateProfile";
import FilterCandidates from "../dashboards/corporateDashboard/FilterCandidates";
import CorporateSettingsPage from "../dashboards/corporateDashboard/setting/CorporateSettingsPage";
import CandidateProfilePage from "../dashboards/corporateDashboard/CandidateProfilePage";
import { CorporateProvider } from "../context/CorporateContext";
import BookmarkedCandidatesPage from "../dashboards/corporateDashboard/BookmarkedCandidatesPage";

// CorporateRoutes component that defines routes specific to the corporate's dashboard
const CorporateRoutes = () => {
  return (
    <CorporateProvider>
      <Routes>
        {/* Route for corporate's main dashboard page */}
        <Route path="/corporate-dashboard" element={<CorporateDashboard />} />

        {/* Route for editing the corporate's profile */}
        <Route
          path="/corporate/edit-profile"
          element={<EditCorporateProfile />}
        />

        {/* Route for filtering and viewing candidates for the corporate */}
        <Route
          path="/corporate/filter-candidate"
          element={<FilterCandidates />}
        />
        <Route path="/corporate-settings" element={<CorporateSettingsPage />} />

        <Route
          path="/candidateProfile/:id"
          element={<CandidateProfilePage />}
        />
        <Route
          path="/corporate-bookmarked"
          element={<BookmarkedCandidatesPage />}
        />
      </Routes>
    </CorporateProvider>
  );
};

export default CorporateRoutes;
