import { useState } from "react";
import api from "../../api/api";
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  ClipboardList,
} from "lucide-react";

export default function JobForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary_range: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/jobs", formData);
      setFormData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary_range: "",
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="card shadow-lg border-0 p-4 p-md-5 w-100"
        style={{ maxWidth: "700px" }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-3" style={{ width: 56, height: 56 }}>
            <Briefcase size={28} />
          </div>
          <h3 className="fw-bold mb-1">Post a New Job</h3>
          <p className="text-muted mb-0">
            Fill in the details to attract the right candidates
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center py-2">
            {error}
          </div>
        )}

        {/* JOB TITLE */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Job Title</label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <Briefcase size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* LOCATION & SALARY */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Location</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <MapPin size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Remote / City"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Salary Range <span className="text-muted">(optional)</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <DollarSign size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="$80,000 - $120,000"
                value={formData.salary_range}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary_range: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Job Description</label>
          <div className="input-group">
            <span className="input-group-text bg-light align-items-start">
              <FileText size={18} />
            </span>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe the role, responsibilities, and expectations..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        {/* REQUIREMENTS */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Requirements / Skills
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light align-items-start">
              <ClipboardList size={18} />
            </span>
            <textarea
              className="form-control"
              rows="4"
              placeholder="React, Node.js, 2+ years experience, etc."
              value={formData.requirements}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requirements: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" />
              Posting Job...
            </>
          ) : (
            "Post Job"
          )}
        </button>
      </form>
    </div>
  );
}
