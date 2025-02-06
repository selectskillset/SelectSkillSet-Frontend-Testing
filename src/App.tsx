import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { HomePage } from "./components/home/HomePage";

import { Toaster } from "react-hot-toast";
import CandidateDashboard from "./dashboards/candidateDashboard/CandidateDashboard";
import EditCandidateProfile from "./dashboards/candidateDashboard/EditCandidateProfile";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { LoginPage } from "./components/auth/LoginPage";
import { CandidateLogin } from "./components/auth/candidate/CandidateLogin";
import { CandidateSignup } from "./components/auth/candidate/CandidateSignup";
import { CorporateLogin } from "./components/auth/corporate/CorporateLogin";
import { CorporateSignup } from "./components/auth/corporate/CorporateSignup";
import { InterviewerLogin } from "./components/auth/Interviewer/InterviewerLogin";
import { InterviewerSignup } from "./components/auth/Interviewer/InterviewerSignup";
import InterviewerDashboard from "./dashboards/InterviewerDashboard/InterviewerDashboard";
import EditInterviewerProfile from "./dashboards/InterviewerDashboard/EditInterviewerProfile";
import { VerifyOtp } from "./components/auth/VerifyOtp";
import AboutUsPage from "./pages/about/AboutUsPage";
import InterviewerProfile from "./pages/profile/InterviewerProfile";
import InterviewEvaluationForm from "./dashboards/InterviewerDashboard/InterviewEvaluationForm";
import CandidateEvaluationForm from "./dashboards/candidateDashboard/CandidateEvaluationForm";
import AdminDashboard from "./dashboards/adminDashboard/AdminDashboard";
import AdminLogin from "./dashboards/adminDashboard/AdminLogin";
import Footer from "./components/common/Footer";
import AdminProfiles from "./dashboards/adminDashboard/AdminProfiles";
import CorporateDashboard from "./dashboards/corporateDashboard/CorporateDashboard";
import EditCorporateProfile from "./dashboards/corporateDashboard/EditCorporateProfile";
import FilterCandidates from "./dashboards/corporateDashboard/FilterCandidates";
import Chatbot from "./components/ui/Chatbot";
import FeatureAnimation from "./components/ui/FeatureAnimation";
import RequestDemoPage from "./pages/requestDemo/RequestDemoPage.js";
import TermsAndConditions from "./pages/termsAndConditionPage/TermsAndConditions.js";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <div className="min-h-screen bg-[#F3F2EF]">
          <Navbar />
          <ScrollToTop />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/products" element={<FeatureAnimation />} />
              <Route path="/request-demo" element={<RequestDemoPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route
                path="/interviewer-profile/:id"
                element={<InterviewerProfile />}
              />
              <Route
                path="/interviewer-feedback/:candidateId/:interviewRequestId"
                element={<InterviewEvaluationForm />}
              />
              <Route
                path="/candidate-feedback/:interviewerId/:interviewRequestId"
                element={<CandidateEvaluationForm />}
              />
              <Route path="/login" element={<LoginPage />} />

              <Route path="/candidate-login" element={<CandidateLogin />} />
              <Route path="/candidate-signup" element={<CandidateSignup />} />
              <Route
                path="/candidate-dashboard"
                element={<CandidateDashboard />}
              />
              <Route path="/corporate-login" element={<CorporateLogin />} />
              <Route path="/corporate-signup" element={<CorporateSignup />} />
              <Route
                path="/corporate-dashboard"
                element={<CorporateDashboard />}
              />
              <Route
                path="/corporate/edit-profile"
                element={<EditCorporateProfile />}
              />
              <Route
                path="/corporate/filter-candidate"
                element={<FilterCandidates />}
              />
              <Route
                path="/interviewer-dashboard"
                element={<InterviewerDashboard />}
              />
              <Route path="/interviewer-login" element={<InterviewerLogin />} />
              <Route
                path="/interviewer-signup"
                element={<InterviewerSignup />}
              />
              <Route
                path="/edit-candidate-profile"
                element={<EditCandidateProfile />}
              />
              <Route
                path="/edit-interviewer-profile"
                element={<EditInterviewerProfile />}
              />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/dashboard/profiles"
                element={<AdminProfiles />}
              />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
          </div>
          <Toaster
            toastOptions={{
              duration: 5000,
              style: {
                fontSize: "18px",
                padding: "16px",
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              },
              success: {
                style: {
                  background: "#28a745",
                },
              },
              error: {
                style: {
                  background: "#dc3545",
                },
              },
            }}
          />
          <Chatbot />
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
