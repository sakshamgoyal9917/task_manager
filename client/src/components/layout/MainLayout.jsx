import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageKey, setPageKey] = useState(0);

  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Handle route change
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setPageKey((k) => k + 1);
      setSidebarOpen(false);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  const isDesktop =
    typeof window !== "undefined" &&
    window.innerWidth >= 768;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      {/* Mobile Backdrop */}
      {!isDesktop && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: isDesktop ? "relative" : "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: isDesktop ? "auto" : 30,

          transform: isDesktop
            ? "translateX(0)"
            : sidebarOpen
            ? "translateX(0)"
            : "translateX(-100%)",

          transition:
            "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
          }}
        >
          <Sidebar onClose={closeSidebar} />
        </div>
      </div>

      {/* Main Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main
          key={pageKey}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "24px",
            animation:
              "slide-up 0.4s cubic-bezier(0.34,1.1,0.64,1) both",
          }}
        >
          <div className="stagger-children">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;