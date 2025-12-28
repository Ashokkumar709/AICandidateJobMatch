import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../components/contexts/AuthContext";
import {
  FileText,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  ArrowLeft,
  LogOut,
  Briefcase,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

/* =====================================================
   SMART PARSER
===================================================== */
function parseToNumberedPoints(text = "") {
  if (!text) return [];

  return text
    .replace(/\r/g, "")
    .split(/(?=\d+[\.\)\-]\s*)/)
    .flatMap(block =>
      block
        .replace(/^\d+[\.\)\-]\s*/, "")
        .split(/•/)
        .map(t => t.trim())
        .filter(Boolean)
    );
}

export default function CandidateJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  if (!user) return <Navigate to="/login" />;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [jobRes, resumeRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get("/resumes/me"),
      ]);

      setJob(jobRes.data);
      setResume(
        Array.isArray(resumeRes.data)
          ? resumeRes.data[0]
          : resumeRes.data
      );
    } catch {
      setJob(null);
    } finally {
      setLoading(false);
    }
  }

  async function generateMatch() {
    if (!resume) {
      alert("Upload a resume first");
      return;
    }

    setGenerating(true);
    try {
      const res = await api.post("/matches", {
        jobId: job._id,
        resumeId: resume._id,
      });
      setMatchResult(res.data);
    } catch (err) {
      if (err.response?.data?.application) {
        setMatchResult(err.response.data.application);
      } else {
        alert("Failed to generate match");
      }
    } finally {
      setGenerating(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!job) return <p className="text-center">Job not found</p>;

  return (
    <div className="min-vh-100 bg-light">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar bg-white shadow-sm px-4">
        <div className="d-flex align-items-center gap-2">
          <Briefcase className="text-primary" />
          <span className="fw-bold fs-5">Job Details</span>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="container py-5">
        <div className="row g-5">

          {/* ================= RESUME CARD ================= */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: 90 }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FileText className="text-primary" /> Your Resume
                </h5>

                {resume ? (
                  <>
                    <p className="fw-semibold">{resume.fileName}</p>

                    <h6 className="fw-semibold text-success mb-2">
                      Skills Detected
                    </h6>

                    {resume.skills?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {resume.skills.map((s, i) => (
                          <span
                            key={i}
                            className="badge bg-success-subtle text-success"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small">No skills detected</p>
                    )}

                    {resume.fileUrl && (
                      <>
                        <hr />
                        <iframe
                          src={`http://localhost:5000${resume.fileUrl}`}
                          height="360"
                          width="100%"
                          style={{ borderRadius: 10 }}
                          title="Resume"
                        />
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-muted">No resume uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* ================= JOB + MATCH ================= */}
          <div className="col-lg-8">

            {/* JOB DETAILS */}
            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="fw-bold">{job.title}</h2>

                <div className="text-muted small mb-4 d-flex gap-3 flex-wrap">
                  <span><MapPin size={14} /> {job.location}</span>
                  {job.salary_range && (
                    <span><DollarSign size={14} /> {job.salary_range}</span>
                  )}
                  <span><Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>

                <h6 className="fw-semibold">Job Description</h6>
                <ul>
                  {parseToNumberedPoints(job.description).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>

                <h6 className="fw-semibold mt-3">Requirements</h6>
                <ul>
                  {parseToNumberedPoints(job.requirements).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>

                <button
                  className="btn btn-primary btn-lg mt-3 d-flex align-items-center gap-2"
                  disabled={!resume || generating}
                  onClick={generateMatch}
                >
                  <Sparkles size={18} />
                  {generating ? "Analyzing..." : "Apply & Get AI Match"}
                </button>
              </div>
            </div>

            {/* ================= MATCH RESULT ================= */}
            {matchResult && (
              <div className="card shadow-lg border-0">
                <div className="card-body p-4">

                  <h4 className="fw-bold text-primary mb-4">
                    AI Match Analysis
                  </h4>

                  {/* SCORE CIRCLE */}
                  <div className="d-flex justify-content-center mb-4">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: 140,
                        height: 140,
                        fontSize: 36,
                        background: "linear-gradient(135deg,#4ade80,#22c55e)",
                        color: "#064e3b",
                      }}
                    >
                      {matchResult.match_score}%
                    </div>
                  </div>

                  <div className="row g-4">
                    {/* FOUND */}
                    <div className="col-md-6">
                      <h6 className="fw-semibold text-success d-flex align-items-center gap-1">
                        <CheckCircle size={16} /> Skills Matched
                      </h6>
                      {matchResult.skills_found.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {matchResult.skills_found.map((s, i) => (
                            <span
                              key={i}
                              className="badge bg-success-subtle text-success"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small">No matching skills</p>
                      )}
                    </div>

                    {/* MISSING */}
                    <div className="col-md-6">
                      <h6 className="fw-semibold text-danger d-flex align-items-center gap-1">
                        <AlertTriangle size={16} /> Missing Skills
                      </h6>
                      {matchResult.missing_skills.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {matchResult.missing_skills.map((s, i) => (
                            <span
                              key={i}
                              className="badge bg-danger-subtle text-danger"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-success small">No missing skills 🎉</p>
                      )}
                    </div>
                  </div>

                  <hr />

                  <h6 className="fw-semibold">AI Recommendation</h6>
                  <p className="mb-0 text-muted">
                    {matchResult.summary}
                  </p>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
