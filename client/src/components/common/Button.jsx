const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontWeight: 600,
    borderRadius: 10,
    border: "none",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.5 : 1,
    transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
    position: "relative",
    overflow: "hidden",
  };

  const variants = {
    primary: {
      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
      color: "white",
      boxShadow: "0 4px 14px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
      border: "1px solid rgba(99,102,241,0.5)",
    },
    secondary: {
      background: "rgba(255,255,255,0.06)",
      color: "rgba(148,163,184,0.9)",
      boxShadow: "none",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    danger: {
      background: "linear-gradient(135deg, rgba(239,68,68,0.85), rgba(220,38,38,0.85))",
      color: "white",
      boxShadow: "0 4px 14px rgba(239,68,68,0.25)",
      border: "1px solid rgba(239,68,68,0.4)",
    },
    ghost: {
      background: "transparent",
      color: "rgba(148,163,184,0.7)",
      boxShadow: "none",
      border: "1px solid transparent",
    },
  };

  const sizes = {
    sm: { padding: "6px 13px", fontSize: "0.78rem" },
    md: { padding: "9px 18px", fontSize: "0.85rem" },
    lg: { padding: "12px 26px", fontSize: "0.95rem" },
  };

  const style = { ...base, ...variants[variant], ...sizes[size] };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    if (variant === "primary") {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.2)";
    } else if (variant === "secondary") {
      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
      e.currentTarget.style.color = "rgba(241,245,249,0.95)";
    } else if (variant === "danger") {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(239,68,68,0.4)";
    } else if (variant === "ghost") {
      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      e.currentTarget.style.color = "rgba(148,163,184,0.9)";
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    Object.assign(e.currentTarget.style, {
      transform: "translateY(0)",
      background: variants[variant].background,
      boxShadow: variants[variant].boxShadow || "none",
      color: variants[variant].color,
      borderColor: "",
    });
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {loading && (
        <svg
          width="14" height="14"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{ animation: "spin 0.7s linear infinite", flexShrink: 0 }}
        >
          <path d="M21 12a9 9 0 1 1-6.22-8.56" strokeLinecap="round"/>
        </svg>
      )}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default Button;