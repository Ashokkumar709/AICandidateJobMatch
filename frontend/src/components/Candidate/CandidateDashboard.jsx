import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import ResumeUpload from "./ResumeUpload";
import { JobBrowser } from "./JobBrowser";
import api from "../../api/api";
import { useAuth } from "../../components/contexts/AuthContext";
import {
  FileText,
  Briefcase,
  UploadCloud,
  Trash2,
  LogOut,
  User,
} from "lucide-react";

export default function CandidateDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  if (!user) return <Navigate to="/login" />;

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const res = await api.get("/resumes/me");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data
        ? [res.data]
        : [];
      setResumes(data);
    } catch (err) {
      console.error("Failed to load resumes", err);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function deleteResume(resumeId) {
    if (!window.confirm("Delete this resume permanently?")) return;

    setDeletingId(resumeId);
    try {
      await api.delete(`/resumes/${resumeId}`);
      await loadResumes();
    } catch {
      alert("Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  }

  const latestResume = resumes[0];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-2">
            <User className="text-primary" />
            <span className="fw-bold fs-5">Candidate Dashboard</span>
          </div>

          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container py-5">
        <div className="row g-5">

          {/* ================= LEFT PANEL ================= */}
          <div className="col-lg-5">

            {/* UPLOAD RESUME */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <UploadCloud className="text-primary" />
                  <h5 className="fw-bold mb-0">Upload Resume</h5>
                </div>
                <ResumeUpload onSuccess={loadResumes} />
              </div>
            </div>

            {/* RESUMES LIST */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FileText className="text-primary" />
                  <h5 className="fw-bold mb-0">Your Resumes</h5>
                </div>

                {resumes.length === 0 ? (
                  <p className="text-muted mb-0">
                    No resumes uploaded yet.
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {resumes.map((resume) => (
                      <div
                        key={resume._id}
                        className={`border rounded p-3 ${
                          resume._id === latestResume?._id
                            ? "border-success bg-success-subtle"
                            : ""
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-semibold mb-1">
                              {resume.fileName}
                            </h6>
                            <small className="text-muted">
                              Uploaded{" "}
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </small>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={deletingId === resume._id}
                            onClick={() => deleteResume(resume._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* ACTIVE BADGE */}
                        {resume._id === latestResume?._id && (
                          <span className="badge bg-success mt-2">
                            Active Resume
                          </span>
                        )}

                        {/* SKILLS */}
                        {resume.skills?.length > 0 && (
                          <div className="mt-3 d-flex flex-wrap gap-2">
                            {resume.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="badge bg-primary-subtle text-primary"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <Briefcase className="text-primary" />
                  <h4 className="fw-bold mb-0">Available Jobs</h4>
                </div>

                <JobBrowser resumeId={latestResume?._id} />

                {!latestResume && (
                  <div className="alert alert-info mt-4">
                    Upload a resume to apply and receive AI match scores.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
