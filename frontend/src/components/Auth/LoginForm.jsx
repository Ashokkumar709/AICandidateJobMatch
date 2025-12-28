import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/contexts/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";

export function LoginForm({ onToggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // signIn should return user data
      const user = await signIn(email, password);

      // 🔁 ROUTE BASED REDIRECT
      if (user.role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/candidate");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to sign in"
      );
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
        <h2 className="text-center fw-bold mb-4">Sign In</h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

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
        <div className="mb-4">
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
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          <LogIn size={18} />
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* TOGGLE SIGNUP */}
        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={onToggleForm}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
