import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../components/contexts/AuthContext";

import JobForm from "./JobForm";
import JobsList from "./JobsList";
import { MatchesList } from "../Matches/MatchesList";

import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  ClipboardList,
  Trash2,
  LogOut,
  Briefcase,
} from "lucide-react";

/* ================= HELPERS ================= */
function toBullets(text = "") {
  if (!text) return [];

  return text
    .replace(/\r/g, "")
    .replace(/•/g, "\n")
    .replace(/-\s+/g, "\n")
    .replace(/\d+\)/g, "\n")
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 5);
}

export default function RecruiterDashboard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ================= LOAD JOB ================= */
  useEffect(() => {
    if (!jobId) {
      setJob(null);
      return;
    }
    loadJob();
  }, [jobId]);

  async function loadJob() {
    setLoadingJob(true);
    try {
      const res = await api.get(`/jobs/${jobId}`);
      setJob(res.data);
    } catch {
      setJob(null);
    } finally {
      setLoadingJob(false);
    }
  }

  /* ================= DELETE JOB ================= */
  async function handleDelete() {
    if (!window.confirm("Delete this job permanently?")) return;

    setDeleting(true);
    try {
      await api.delete(`/jobs/${jobId}`);
      navigate("/recruiter");
    } catch {
      alert("Failed to delete job");
    } finally {
      setDeleting(false);
    }
  }

  /* ================= LOGOUT ================= */
  function handleLogout() {
    signOut();
    navigate("/");
  }

  /* ================= DASHBOARD (NO JOB SELECTED) ================= */
  if (!jobId) {
    return (
      <div className="min-vh-100 bg-light">
        <nav className="navbar bg-white shadow-sm px-4">
          <div className="d-flex align-items-center gap-2">
            <Briefcase className="text-primary" />
            <span className="fw-bold fs-5">Recruiter Dashboard</span>
          </div>

          <button
            className="btn btn-outline-danger d-flex align-items-center gap-1"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>

        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-5">
              <JobForm onSuccess={() => navigate("/recruiter")} />
            </div>

            <div className="col-lg-7">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Your Job Postings</h5>
                  <JobsList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= JOB DETAILS VIEW ================= */
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar bg-white shadow-sm px-4">
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/recruiter")}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            className="btn btn-outline-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={16} /> {deleting ? "Deleting..." : "Delete Job"}
          </button>
        </div>

        <button
          className="btn btn-outline-danger d-flex align-items-center gap-1"
          onClick={handleLogout}
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="container py-5">
        {loadingJob ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : !job ? (
          <p className="text-center text-muted">Job not found</p>
        ) : (
          <>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h2 className="fw-bold">{job.title}</h2>

                <div className="text-muted small d-flex gap-3 flex-wrap mt-2">
                  <span><MapPin size={14} /> {job.location}</span>
                  {job.salary_range && (
                    <span><DollarSign size={14} /> {job.salary_range}</span>
                  )}
                  <span><Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* LEFT */}
              <div className="col-lg-8">
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-body">
                    <h5 className="fw-bold mb-2">
                      <FileText size={18} /> Job Description
                    </h5>
                    <ul>
                      {toBullets(job.description).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-2">
                      <ClipboardList size={18} /> Requirements
                    </h5>
                    <ul>
                      {toBullets(job.requirements).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Applied Candidates</h5>
                    <MatchesList jobId={jobId} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
