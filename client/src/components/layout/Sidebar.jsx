import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    path: "/projects",
    label: "Projects",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
  },
  {
    path: "/tasks",
    label: "Tasks",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        background: "linear-gradient(180deg, #0d1424 0%, #080d1a 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient top glow ── */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Logo ── */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: mounted ? "slide-in-left 0.4s ease both" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo mark */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              TaskFlow
            </h1>
            <p
              style={{
                fontSize: "0.68rem",
                color: "rgba(148,163,184,0.6)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              Team Manager
            </p>
          </div>
        </div>

        {/* Close — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden"
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(148,163,184,0.8)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            fontSize: 14,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "rgba(148,163,184,0.8)";
          }}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      {/* ── User card ── */}
      <div
        style={{
          margin: "14px 12px",
          padding: "12px 14px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 11,
          animation: mounted ? "fade-in 0.5s 0.1s ease both" : "none",
          opacity: mounted ? 1 : 0,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "white",
            flexShrink: 0,
            boxShadow: "0 0 0 2px rgba(99,102,241,0.3)",
            letterSpacing: "-0.02em",
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontSize: "0.83rem",
              fontWeight: 600,
              color: "rgba(241,245,249,0.95)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px rgba(16,185,129,0.6)",
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontSize: "0.7rem",
                color: "rgba(148,163,184,0.7)",
                textTransform: "capitalize",
              }}
            >
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav label ── */}
      <div
        style={{
          padding: "6px 20px 8px",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(148,163,184,0.35)",
        }}
      >
        Navigation
      </div>

      {/* ── Nav items ── */}
      <nav
        style={{
          flex: 1,
          padding: "0 10px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {navItems.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            style={{
              animationDelay: `${0.15 + i * 0.07}s`,
              animation: mounted ? `slide-in-left 0.4s ease both` : "none",
              opacity: mounted ? 1 : 0,
            }}
            className={({ isActive }) => (isActive ? "nav-item-active" : "nav-item")}
          >
            {({ isActive }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "10px 14px",
                  borderRadius: 11,
                  fontSize: "0.865rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "white" : "rgba(148,163,184,0.7)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.15))"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(99,102,241,0.3)"
                    : "1px solid transparent",
                  boxShadow: isActive ? "0 4px 14px rgba(99,102,241,0.15)" : "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(241,245,249,0.9)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(148,163,184,0.7)";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 20,
                      borderRadius: "0 3px 3px 0",
                      background: "linear-gradient(180deg, #818cf8, #6366f1)",
                      boxShadow: "0 0 8px rgba(99,102,241,0.6)",
                    }}
                  />
                )}
                <span
                  style={{
                    color: isActive ? "rgba(165,168,255,0.9)" : "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div
        style={{
          padding: "12px 10px 20px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "10px 14px",
            borderRadius: 11,
            fontSize: "0.865rem",
            fontWeight: 500,
            color: "rgba(148,163,184,0.6)",
            background: "transparent",
            border: "1px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(148,163,184,0.6)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;