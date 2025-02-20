import { Routes, Route } from "react-router-dom";
import { HomePage } from "../components/home/HomePage";
import AboutUsPage from "../pages/about/AboutUsPage";
import FeatureAnimation from "../components/ui/FeatureAnimation";
import RequestDemoPage from "../pages/requestDemo/RequestDemoPage";
import TermsAndConditions from "../pages/termsAndConditionPage/TermsAndConditions";
import InterviewerProfile from "../pages/profile/InterviewerProfile";

// PublicRoutes component that defines routes for public-facing pages of the website
const PublicRoutes = () => {
  return (
    <Routes>
      {/* Route for the homepage of the website */}
      <Route path="/" element={<HomePage />} />

      {/* Route for the "About Us" page */}
      <Route path="/about" element={<AboutUsPage />} />

      {/* Route for displaying the product features with animations */}
      <Route path="/products" element={<FeatureAnimation />} />

      {/* Route for the demo request page */}
      <Route path="/request-demo" element={<RequestDemoPage />} />

      {/* Route for displaying the terms and conditions page */}
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      {/* Dynamic route for viewing the profile of a specific interviewer based on their ID */}
      <Route path="/interviewer-profile/:id" element={<InterviewerProfile />} />

     
    </Routes>
  );
};

export default PublicRoutes;
