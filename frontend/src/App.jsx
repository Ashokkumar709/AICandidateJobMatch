import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";

import AuthPage from "./components/Auth/AuthPage";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
// import JobsList from "./components/Recruiter/JobsList";
import CandidateDashboard from "./components/Candidate/CandidateDashboard";
import CandidateJobDetails from "./components/Candidate/CandidateJobDetails";

/* ---------------- PROTECTED ROUTE ---------------- */
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" />;

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

/* ---------------- APP ROUTES ---------------- */
function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<AuthPage />} />

      <Route
          path="/recruiter"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:jobId"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />


      {/* CANDIDATE */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute role="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/candidate/jobs/:id" element={<ProtectedRoute role="candidate"><CandidateJobDetails /></ProtectedRoute>} />


      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

/* ---------------- ROOT APP ---------------- */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
