import { useState } from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = "",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }} className={className}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: focused ? "rgba(165,168,255,0.85)" : "rgba(148,163,184,0.75)",
            transition: "color 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {label}
          {required && (
            <span style={{ color: error ? "#f87171" : "rgba(239,68,68,0.7)", fontSize: "0.75rem" }}>*</span>
          )}
        </label>
      )}

      <div style={{ position: "relative" }}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: "0.85rem",
            background: disabled
              ? "rgba(255,255,255,0.02)"
              : focused
              ? "rgba(99,102,241,0.06)"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${
              error
                ? "rgba(239,68,68,0.45)"
                : focused
                ? "rgba(99,102,241,0.55)"
                : "rgba(255,255,255,0.1)"
            }`,
            borderRadius: 10,
            color: disabled ? "rgba(100,116,139,0.5)" : "rgba(241,245,249,0.9)",
            outline: "none",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
            boxSizing: "border-box",
            boxShadow: focused
              ? `0 0 0 3px ${error ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.12)"}`
              : "none",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        {/* Focus shimmer line */}
        <div style={{
          position:"absolute", bottom:0, left:"50%",
          transform: focused ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
          width:"calc(100% - 20px)", height:2,
          background: error
            ? "linear-gradient(90deg, transparent, rgba(239,68,68,0.7), transparent)"
            : "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)",
          borderRadius:"0 0 4px 4px",
          transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents:"none",
        }} />
      </div>

      {error && (
        <p style={{
          fontSize: "0.75rem",
          color: "#f87171",
          display: "flex",
          alignItems: "center",
          gap: 5,
          animation: "shake 0.3s ease",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        input::placeholder { color: rgba(100,116,139,0.45); }
      `}</style>
    </div>
  );
};

export default Input;