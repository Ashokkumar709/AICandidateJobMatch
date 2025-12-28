import { useState } from "react";
import {
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

/* ===============================
   DUMMY DATA
================================ */
const DUMMY_MATCHES = [
  {
    _id: "1",
    name: "Ashok",
    match_score: 75,
    status: "reviewed",
    matching_skills: ["javascript", "react", "node"],
    missing_skills: ["aws", "docker"],
    summary:
      "Strong frontend & backend skills. Needs cloud exposure.",
  },
  {
    _id: "2",
    name: "Rajesh",
    match_score: 85,
    status: "shortlisted",
    matching_skills: ["python", "sql"],
    missing_skills: ["react", "docker"],
    summary:
      "Good backend profile. Frontend skills required.",
  },
  // {
  //   _id: "3",
  //   name: "Alex Kumar",
  //   match_score: 45,
  //   status: "rejected",
  //   matching_skills: ["html", "css"],
  //   missing_skills: ["javascript", "react", "node"],
  //   summary:
  //     "Basic web knowledge. Not suitable for this role.",
  // },
];

/* ===============================
   COMPONENT
================================ */
export function MatchesList() {
  const [matches, setMatches] = useState(DUMMY_MATCHES);

  function updateStatus(id, status) {
    setMatches((prev) =>
      prev.map((m) =>
        m._id === id ? { ...m, status } : m
      )
    );
  }

  function scoreColor(score) {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  }

  function statusBadge(status) {
    switch (status) {
      case "shortlisted":
        return "bg-success-subtle text-success";
      case "rejected":
        return "bg-danger-subtle text-danger";
      default:
        return "bg-primary-subtle text-primary";
    }
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-5">
        <User size={48} className="text-muted mb-2" />
        <p className="text-muted">No applications yet</p>
      </div>
    );
  }

  return (
    <div className="row g-3">

      {matches.map((m) => (
        <div key={m._id} className="col-md-6">

          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3">

              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-semibold mb-0">{m.name}</h6>
                <span className={`badge ${statusBadge(m.status)}`}>
                  {m.status}
                </span>
              </div>

              {/* SCORE */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className={`rounded-circle border d-flex align-items-center justify-content-center fw-bold ${scoreColor(
                    m.match_score
                  )}`}
                  style={{ width: 52, height: 52 }}
                >
                  {m.match_score}%
                </div>
                <small className="text-muted">
                  Match Score
                </small>
              </div>

              {/* MATCHED */}
              <div className="mb-2">
                <small className="fw-semibold text-success">
                  Matched Skills
                </small>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {m.matching_skills.map((s, i) => (
                    <span
                      key={i}
                      className="badge bg-success-subtle text-success small"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* MISSING */}
              <div className="mb-2">
                <small className="fw-semibold text-danger">
                  Missing Skills
                </small>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {m.missing_skills.map((s, i) => (
                    <span
                      key={i}
                      className="badge bg-danger-subtle text-danger small"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* SUMMARY */}
              <p className="text-muted small mt-2 mb-3">
                {m.summary}
              </p>

              {/* ACTIONS */}
              <div className="d-flex gap-2">
                {m.status !== "shortlisted" && (
                  <button
                    className="btn btn-sm btn-success flex-fill"
                    onClick={() =>
                      updateStatus(m._id, "shortlisted")
                    }
                  >
                    <CheckCircle size={14} /> Shortlist
                  </button>
                )}

                {m.status !== "rejected" && (
                  <button
                    className="btn btn-sm btn-outline-danger flex-fill"
                    onClick={() =>
                      updateStatus(m._id, "rejected")
                    }
                  >
                    <XCircle size={14} /> Reject
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      ))}

    </div>
  );
}
