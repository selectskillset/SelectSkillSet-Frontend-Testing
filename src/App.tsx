import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner"; // Changed from sonner to sonner

// Navbar Component
import { Navbar } from "./components/common/Navbar";

// Common Components
import { ScrollToTop } from "./components/common/ScrollToTop";
import Footer from "./components/common/Footer";

// Route Components
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
               Sonner Toast Notification System
          -------------------------------------------------- */}
          <Toaster
            position="top-center"
            theme="light"
            richColors
            toastOptions={{
              classNames: {
                toast: "!font-sans !text-base !rounded-lg !border !shadow-lg",
                title: "!font-medium",
                description: "!text-sm",
              },
              unstyled: false,
            }}
            visibleToasts={4}
            duration={3000}
          />

          {/* -------------------------------------------------
               Footer (Visible on All Pages)
          -------------------------------------------------- */}
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
