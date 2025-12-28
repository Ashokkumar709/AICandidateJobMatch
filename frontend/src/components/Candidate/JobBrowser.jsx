import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { MapPin } from "lucide-react";

export function JobBrowser() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const res = await api.get("/jobs/all");
      setJobs(res.data || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="spinner-border text-primary" />;
  }

  return (
    <div className="list-group">
      {jobs.map(job => (
        <button
          key={job._id}
          className="list-group-item list-group-item-action"
          onClick={() => navigate(`/candidate/jobs/${job._id}`)}
        >
          <h6 className="fw-bold mb-1">{job.title}</h6>
          <small className="text-muted d-flex gap-2">
            <MapPin size={14} /> {job.location}
          </small>
        </button>
      ))}
    </div>
  );
}
