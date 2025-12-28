import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Briefcase, ChevronRight } from "lucide-react";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const res = await api.get("/jobs/my");
      setJobs(res.data || []);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  /* LOADING */
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  /* EMPTY */
  if (jobs.length === 0) {
    return (
      <div className="card shadow-sm text-center p-5 border-0">
        <Briefcase size={48} className="mx-auto text-secondary mb-3" />
        <h5 className="fw-semibold">No Jobs Posted Yet</h5>
        <p className="text-muted mb-0">
          Start by posting your first job opening
        </p>
      </div>
    );
  }

  /* LIST */
  return (
    <div className="list-group list-group-flush">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="list-group-item d-flex justify-content-between align-items-center py-3 job-row"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
        >
          <span className="fw-semibold">{job.title}</span>

          <span className="text-primary d-flex align-items-center gap-1 small">
            View details <ChevronRight size={14} />
          </span>
        </div>
      ))}

      <style>{`
        .job-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}
