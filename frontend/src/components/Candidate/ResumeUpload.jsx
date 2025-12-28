import { useState } from "react";
import api from "../../api/api";
import { Upload, FileText, Loader } from "lucide-react";

export default function ResumeUpload({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      await api.post("/resumes", formData);

      setFile(null);
      onSuccess(); // reload resume
    } catch (err) {
      console.error(err);
      setError("Failed to upload resume");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm p-4">
      <h4 className="fw-bold mb-3 text-center">Upload Your Resume</h4>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      <div className="mb-4 text-center border border-2 border-dashed rounded p-4">
        <input
          type="file"
          accept=".txt"
          className="d-none"
          id="resume-upload"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />

        <label htmlFor="resume-upload" style={{ cursor: "pointer" }}>
          {file ? (
            <>
              <FileText size={48} className="text-primary mb-2" />
              <p className="fw-semibold">{file.name}</p>
            </>
          ) : (
            <>
              <Upload size={48} className="text-secondary mb-2" />
              <p className="fw-semibold">Click to upload resume</p>
            </>
          )}
        </label>
      </div>

      <button
        className="btn btn-primary w-100"
        disabled={loading || !file}
      >
        {loading ? (
          <>
            <Loader className="spinner-border spinner-border-sm me-2" />
            Uploading...
          </>
        ) : (
          "Upload Resume"
        )}
      </button>
    </form>
  );
}
