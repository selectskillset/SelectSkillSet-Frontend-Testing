import { BrowserRouter as Router } from "react-router-dom";

// Navbar Component
import { Navbar } from "./components/common/Navbar";

// Notification System
import { Toaster } from "react-hot-toast";

// Common Components
import { ScrollToTop } from "./components/common/ScrollToTop";
import Footer from "./components/common/Footer";
import Chatbot from "./components/ui/Chatbot";

// Route Components (Separated for Different User Roles)
import PublicRoutes from "./routes/PublicRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import CandidateRoutes from "./routes/CandidateRoutes";
import CorporateRoutes from "./routes/CorporateRoutes";
import InterviewerRoutes from "./routes/InterviewerRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        {/* -------------------------------------------------
             Navbar (Visible on All Pages)
        -------------------------------------------------- */}
        <Navbar />

        {/* -------------------------------------------------
            🔄 Scroll to Top on Route Change
        -------------------------------------------------- */}
        <ScrollToTop />

        {/* -------------------------------------------------
             Main Content Section
        -------------------------------------------------- */}
        <div className="flex-grow">
          {/* 🌎 Public Routes (Accessible to Everyone) */}
          <PublicRoutes />

          {/*  Authentication Routes (Login, Signup, etc.) */}
          <AuthRoutes />

          {/*  Candidate Routes (Candidate Dashboard & Features) */}
          <CandidateRoutes />

          {/*  Corporate Routes (Corporate Dashboard & Features) */}
          <CorporateRoutes />

          {/*  Interviewer Routes (Interviewer Dashboard & Features) */}
          <InterviewerRoutes />

          {/*  Admin Routes (Admin Panel & Management) */}
          <AdminRoutes />

          {/* -------------------------------------------------
               Notification System (react-hot-toast)
          -------------------------------------------------- */}
          <Toaster
            toastOptions={{
              duration: 2000,
              style: {
                fontSize: "18px",
                padding: "16px",
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              },
              success: {
                style: { background: "#0077B5", color: "white" },
              },
              error: {
                style: {
                  background: "#dc3545",
                },
              },
            }}
          />

          {/* -------------------------------------------------
               Chatbot & Footer (Visible on All Pages)
          -------------------------------------------------- */}
          <Chatbot />
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
