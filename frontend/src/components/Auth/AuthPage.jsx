import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignupForm";
import { Briefcase } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #eff6ff, #dbeafe)"
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center g-5">
          
          {/* LEFT SIDE (INFO PANEL) */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="mb-4 d-flex align-items-center gap-3">
              <Briefcase size={48} className="text-primary" />
              <h1 className="fw-bold text-dark mb-0">TalentMatch AI</h1>
            </div>

            <p className="fs-5 text-secondary mb-4">
              Smart recruitment powered by AI
            </p>

            <ul className="list-unstyled fs-6 text-dark">
              <li className="mb-2">
                <span className="text-primary fw-bold me-2">✓</span>
                AI-powered resume matching with Claude
              </li>
              <li className="mb-2">
                <span className="text-primary fw-bold me-2">✓</span>
                Intelligent skill matching and candidate ranking
              </li>
              <li className="mb-2">
                <span className="text-primary fw-bold me-2">✓</span>
                Recruiter feedback to refine matching accuracy
              </li>
              <li className="mb-2">
                <span className="text-primary fw-bold me-2">✓</span>
                Streamlined hiring process for recruiters and candidates
              </li>
            </ul>
          </div>

          {/* RIGHT SIDE (AUTH FORM) */}
          <div className="col-lg-5 col-md-8 col-sm-10">
            <div className="card shadow-lg border-0 p-4">
              {isLogin ? (
                <LoginForm onToggleForm={() => setIsLogin(false)} />
              ) : (
                <SignUpForm onToggleForm={() => setIsLogin(true)} />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
