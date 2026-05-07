import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;
      login(user, token);
      navigate("/dashboard");
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      backgroundImage: `
        radial-gradient(ellipse 70% 60% at 15% 15%, rgba(99,102,241,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 85% 80%, rgba(6,182,212,0.12) 0%, transparent 50%),
        radial-gradient(ellipse 40% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)
      `,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Floating orbs */}
      <div style={{
        position: "absolute", top: "10%", left: "8%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        animation: "float 6s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "10%",
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
        animation: "float 8s ease-in-out infinite reverse",
        pointerEvents: "none",
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, animation: "slide-up 0.5s cubic-bezier(0.34,1.1,0.64,1) both" }}>
        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            boxShadow: "0 8px 32px rgba(99,102,241,0.5)",
            marginBottom: 16,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: "1.9rem", fontWeight: 800, color: "white",
            letterSpacing: "-0.04em", lineHeight: 1,
          }}>TaskFlow</h1>
          <p style={{ color: "rgba(148,163,184,0.7)", marginTop: 8, fontSize: "0.9rem" }}>
            Sign in to your account
          </p>
        </div>

        {/* Glass card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Card inner glow */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }} />

          {apiError && (
            <div style={{
              marginBottom: 20, padding: "12px 16px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 12,
              animation: "fade-in 0.3s ease both",
            }}>
              <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <GlassInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />
            <GlassInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: "13px",
                borderRadius: 14,
                background: loading
                  ? "rgba(99,102,241,0.4)"
                  : "linear-gradient(135deg, #6366f1, #4f46e5)",
                border: "none",
                color: "white",
                fontSize: "0.925rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.45)",
                transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                letterSpacing: "-0.01em",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.55)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.45)";
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{
            textAlign: "center", fontSize: "0.85rem",
            color: "rgba(148,163,184,0.6)", marginTop: 24,
          }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#a5b4fc"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#818cf8"}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Shared glass input component for auth pages
export const GlassInput = ({ label, name, type = "text", value, onChange, placeholder, error }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(203,213,225,0.8)", letterSpacing: "0.03em" }}>
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: "11px 14px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 11,
        color: "rgba(241,245,249,0.95)",
        fontSize: "0.9rem",
        fontFamily: "inherit",
        outline: "none",
        transition: "all 0.2s ease",
        width: "100%",
      }}
      onFocus={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
    {error && <p style={{ fontSize: "0.75rem", color: "#f87171", marginTop: -2 }}>{error}</p>}
  </div>
);

export default Login;