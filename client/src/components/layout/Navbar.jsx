import { useLocation } from "react-router-dom";
import {
  useState,
  useEffect,
  useRef,
} from "react";

import useAuth from "../../hooks/useAuth";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    subtitle:
      "Here's what's happening today",
  },

  "/projects": {
    title: "Projects",
    subtitle:
      "Manage your team's projects",
  },

  "/tasks": {
    title: "Tasks",
    subtitle:
      "Track and manage your work",
  },
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const location = useLocation();

  const meta =
    pageMeta[location.pathname] || {
      title: "TaskFlow",
      subtitle: "",
    };

  const [scrolled, setScrolled] =
    useState(false);

  const [time, setTime] = useState(
    new Date()
  );

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      const main = e?.target;

      if (main) {
        setScrolled(main.scrollTop > 10);
      }
    };

    const mainEl =
      document.querySelector("main");

    if (mainEl) {
      mainEl.addEventListener(
        "scroll",
        handleScroll
      );
    }

    return () =>
      mainEl?.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          e.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const timeStr =
    time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const dateStr =
    time.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      style={{
        height: "var(--navbar-height)",
        background: scrolled
          ? "rgba(8, 13, 26, 0.92)"
          : "rgba(8, 13, 26, 0.6)",

        backdropFilter:
          "blur(20px) saturate(180%)",

        borderBottom:
          "1px solid rgba(255,255,255,0.05)",

        padding: "0 24px",

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        flexShrink: 0,

        position: "sticky",

        top: 0,

        zIndex: 10,
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background:
              "rgba(255,255,255,0.05)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            color:
              "rgba(148,163,184,0.8)",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* Title */}
        <div>
          <h2
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color:
                "rgba(241,245,249,0.95)",
            }}
          >
            {meta.title}
          </h2>

          <p
            style={{
              fontSize: "0.7rem",
              color:
                "rgba(148,163,184,0.5)",
              marginTop: 2,
            }}
            className="hidden sm:block"
          >
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          position: "relative",
        }}
      >
        {/* Time */}
        <div
          className="hidden md:flex"
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            padding: "6px 12px",
            borderRadius: 9,
            background:
              "rgba(255,255,255,0.03)",
            border:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color:
                "rgba(241,245,249,0.8)",
            }}
          >
            {timeStr}
          </span>

          <span
            style={{
              fontSize: "0.65rem",
              color:
                "rgba(148,163,184,0.45)",
            }}
          >
            {dateStr}
          </span>
        </div>

        {/* User */}
        <div
          ref={profileRef}
          onClick={() =>
            setProfileOpen((prev) => !prev)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "5px 12px 5px 5px",
            borderRadius: 12,
            background:
              "rgba(255,255,255,0.04)",
            border:
              "1px solid rgba(255,255,255,0.07)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
            }}
          >
            {initials}
          </div>

          <div className="hidden sm:block">
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color:
                  "rgba(241,245,249,0.9)",
              }}
            >
              {user?.name?.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* Dropdown */}
        {profileOpen && (
          <div
            style={{
              position: "absolute",
              top: 58,
              right: 0,
              width: 220,
              borderRadius: 16,
              background:
                "rgba(8,13,26,0.96)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter: "blur(20px)",

              overflow: "hidden",

              zIndex: 50,
            }}
          >
            {/* User */}
            <div
              style={{
                padding: 16,
                borderBottom:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {user?.name}
              </p>

              <p
                style={{
                  color:
                    "rgba(148,163,184,0.6)",
                  fontSize: "0.72rem",
                  marginTop: 4,
                }}
              >
                {user?.email}
              </p>

              <div
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  padding: "5px 10px",
                  borderRadius: 999,
                  background:
                    "rgba(99,102,241,0.15)",
                  color: "#a5b4fc",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {user?.role}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                setProfileOpen(false);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                color: "#f87171",
                fontSize: "0.84rem",
                fontWeight: 500,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;