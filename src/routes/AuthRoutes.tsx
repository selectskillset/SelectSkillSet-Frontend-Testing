import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../components/auth/LoginPage";
import { VerifyOtp } from "../components/auth/VerifyOtp";
import { CandidateLogin } from "../components/auth/candidate/CandidateLogin";
import { CandidateSignup } from "../components/auth/candidate/CandidateSignup";
import { CorporateLogin } from "../components/auth/corporate/CorporateLogin";
import { CorporateSignup } from "../components/auth/corporate/CorporateSignup";
import { InterviewerLogin } from "../components/auth/Interviewer/InterviewerLogin";
import { InterviewerSignup } from "../components/auth/Interviewer/InterviewerSignup";

// AuthRoutes component that defines routes for all authentication-related pages
const AuthRoutes = () => {
  return (
    <Routes>
      {/* Route for login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route for OTP verification page */}
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Route for candidate login page */}
      <Route path="/candidate-login" element={<CandidateLogin />} />

      {/* Route for candidate signup page */}
      <Route path="/candidate-signup" element={<CandidateSignup />} />

      {/* Route for corporate login page */}
      <Route path="/corporate-login" element={<CorporateLogin />} />

      {/* Route for corporate signup page */}
      <Route path="/corporate-signup" element={<CorporateSignup />} />

      {/* Route for interviewer login page */}
      <Route path="/interviewer-login" element={<InterviewerLogin />} />

      {/* Route for interviewer signup page */}
      <Route path="/interviewer-signup" element={<InterviewerSignup />} />
    </Routes>
  );
};

export default AuthRoutes;
