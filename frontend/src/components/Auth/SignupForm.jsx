import { useState } from "react";
import { useAuth } from "../../components/contexts/AuthContext";
import { Mail, Lock, User, Building, UserPlus } from "lucide-react";

export function SignUpForm({ onToggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("candidate");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp({
          email,
          password,
          fullName,
          role,
          company: role === "recruiter" ? company : null,
        });

    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-100">
      <form
        onSubmit={handleSubmit}
        className="card shadow-lg border-0 p-4"
        style={{ maxWidth: "420px" }}
      >
        <h2 className="text-center fw-bold mb-4">Create Account</h2>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        {/* FULL NAME */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <User size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text">
              <Mail size={18} />
            </span>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <Lock size={18} />
            </span>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        {/* ROLE */}
        <div className="mb-3">
          <label className="form-label">I am a</label>
          <div className="d-flex gap-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                value="candidate"
                checked={role === "candidate"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label">Candidate</label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                value="recruiter"
                checked={role === "recruiter"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label">Recruiter</label>
            </div>
          </div>
        </div>

        {/* COMPANY (ONLY FOR RECRUITER) */}
        {role === "recruiter" && (
          <div className="mb-4">
            <label className="form-label">Company</label>
            <div className="input-group">
              <span className="input-group-text">
                <Building size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          <UserPlus size={18} />
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* TOGGLE LOGIN */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={onToggleForm}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}
