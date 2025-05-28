import { Routes, Route } from "react-router-dom";
import CorporateDashboard from "../dashboards/corporateDashboard/CorporateDashboard";
import EditCorporateProfile from "../dashboards/corporateDashboard/EditCorporateProfile";
import FilterCandidates from "../dashboards/corporateDashboard/FilterCandidates";
import CorporateSettingsPage from "../dashboards/corporateDashboard/setting/CorporateSettingsPage";
import CandidateProfilePage from "../dashboards/corporateDashboard/CandidateProfilePage";
import { CorporateProvider } from "../context/CorporateContext";
import BookmarkedCandidatesPage from "../dashboards/corporateDashboard/BookmarkedCandidatesPage";
import CorporateLayout from "../dashboards/corporateDashboard/CorporateLayout";
import CandidatesList from "../dashboards/corporateDashboard/CandidatesList";


const CorporateRoutes = () => {
  return (
    <CorporateProvider>
      <Routes>
        <Route element={<CorporateLayout />}>
          {/* Main dashboard route */}
          <Route path="corporate-dashboard" element={<CorporateDashboard />} />
          
          {/* Candidate management routes */}
          <Route path="corporate-candidates" element={<CandidatesList />} />
          <Route path="corporate/filter-candidate" element={<FilterCandidates />} />
          <Route path="candidateProfile/:id" element={<CandidateProfilePage />} />
          
          {/* Bookmarks route */}
          <Route path="corporate-bookmarked" element={<BookmarkedCandidatesPage />} />
          
          
          {/* Profile and settings routes */}
          <Route path="corporate/edit-profile" element={<EditCorporateProfile />} />
          <Route path="corporate-settings" element={<CorporateSettingsPage />} />
        </Route>
      </Routes>
    </CorporateProvider>
  );
};

export default CorporateRoutes;