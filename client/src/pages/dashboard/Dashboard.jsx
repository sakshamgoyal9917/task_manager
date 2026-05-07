import { useNavigate } from "react-router-dom";
import useDashboard from "../../hooks/useDashboard";

// ─── Glass Stat Card ──────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon,
  gradientFrom,
  gradientTo,
  glowColor,
  subtext,
}) => (
  <div
    style={{
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter:
        "blur(20px) saturate(180%)",
      border:
        "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      transition:
        "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      cursor: "pointer",
      boxShadow:
        "0 8px 32px rgba(0,0,0,0.3)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform =
        "translateY(-4px)";
      e.currentTarget.style.borderColor = `rgba(${glowColor}, 0.3)`;
      e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 24px rgba(${glowColor}, 0.15)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform =
        "translateY(0)";
      e.currentTarget.style.borderColor =
        "rgba(255,255,255,0.08)";
      e.currentTarget.style.boxShadow =
        "0 8px 32px rgba(0,0,0,0.3)";
    }}
  >
    {/* Top shimmer */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "20%",
        width: "60%",
        height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${glowColor}, 0.4), transparent)`,
      }}
    />

    {/* Glow blob */}
    <div
      style={{
        position: "absolute",
        bottom: -30,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(${glowColor}, 0.12) 0%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <span
        style={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "rgba(148,163,184,0.7)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>

      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: `linear-gradient(135deg, rgba(${gradientFrom}, 0.25), rgba(${gradientTo}, 0.15))`,
          border: `1px solid rgba(${glowColor}, 0.25)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          boxShadow: `0 4px 12px rgba(${glowColor}, 0.15)`,
        }}
      >
        {icon}
      </div>
    </div>

    <div
      style={{
        fontSize: "2.4rem",
        fontWeight: 800,
        color: "white",
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}
    >
      {value}
    </div>

    {subtext && (
      <p
        style={{
          fontSize: "0.72rem",
          color: "rgba(148,163,184,0.5)",
          marginTop: 6,
        }}
      >
        {subtext}
      </p>
    )}
  </div>
);

// ─── Glass Panel ──────────────────────────────────────────────────
const GlassPanel = ({
  children,
  style = {},
}) => (
  <div
    style={{
      background:
        "rgba(255,255,255,0.04)",
      backdropFilter:
        "blur(20px) saturate(180%)",
      WebkitBackdropFilter:
        "blur(20px) saturate(180%)",
      border:
        "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      boxShadow:
        "0 8px 32px rgba(0,0,0,0.25)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "20%",
        width: "60%",
        height: 1,
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
      }}
    />

    {children}
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  const {
    stats,
    loading,
    error,
  } = useDashboard();

  if (error) {
    return (
      <div
        style={{
          padding: "16px 20px",
          background:
            "rgba(239,68,68,0.1)",
          border:
            "1px solid rgba(239,68,68,0.25)",
          borderRadius: 14,
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            color: "#f87171",
          }}
        >
          {error}
        </p>
      </div>
    );
  }

  const totalTasks =
    stats?.totalTasks ?? 0;

  const doneTasks =
    stats?.tasksByStatus?.done ?? 0;

  const progressPct =
    totalTasks > 0
      ? Math.round(
          (doneTasks / totalTasks) *
            100
        )
      : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "1.65rem",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.04em",
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color:
              "rgba(148,163,184,0.6)",
            marginTop: 4,
            fontSize: "0.875rem",
          }}
        >
          Here's what's happening
          with your projects
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <div
          onClick={() =>
            navigate("/projects")
          }
        >
          <StatCard
            label="Total Projects"
            value={
              stats?.totalProjects ??
              0
            }
            icon="📁"
            gradientFrom="99,102,241"
            gradientTo="79,70,229"
            glowColor="99,102,241"
            subtext="Projects you're part of"
          />
        </div>

        <div
          onClick={() =>
            navigate("/tasks")
          }
        >
          <StatCard
            label="Total Tasks"
            value={totalTasks}
            icon="✅"
            gradientFrom="59,130,246"
            gradientTo="37,99,235"
            glowColor="59,130,246"
            subtext={`${doneTasks} completed`}
          />
        </div>

        <div
          onClick={() =>
            navigate("/tasks")
          }
        >
          <StatCard
            label="In Progress"
            value={
              stats?.tasksByStatus?.[
                "in-progress"
              ] ?? 0
            }
            icon="⚡"
            gradientFrom="245,158,11"
            gradientTo="217,119,6"
            glowColor="245,158,11"
            subtext="Tasks being worked on"
          />
        </div>

        <div
          onClick={() =>
            navigate("/tasks")
          }
        >
          <StatCard
            label="Overdue"
            value={
              stats?.overdueCount ??
              0
            }
            icon="🔴"
            gradientFrom="239,68,68"
            gradientTo="220,38,38"
            glowColor="239,68,68"
            subtext="Tasks past due date"
          />
        </div>
      </div>

      {/* Overview */}
      <GlassPanel>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color:
              "rgba(241,245,249,0.9)",
            marginBottom: 20,
          }}
        >
          Task Overview
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Todo",
              value:
                stats?.tasksByStatus
                  ?.todo ?? 0,
              color:
                "rgba(100,116,139,0.6)",
            },
            {
              label: "In Progress",
              value:
                stats?.tasksByStatus?.[
                  "in-progress"
                ] ?? 0,
              color: "#3b82f6",
            },
            {
              label: "Done",
              value:
                stats?.tasksByStatus
                  ?.done ?? 0,
              color: "#10b981",
            },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() =>
                navigate("/tasks")
              }
              style={{
                textAlign: "center",
                padding: "16px 12px",
                background:
                  "rgba(255,255,255,0.03)",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                cursor: "pointer",
                transition:
                  "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.03)";
              }}
            >
              <div
                style={{
                  height: 3,
                  borderRadius: 999,
                  marginBottom: 14,
                  background:
                    item.color,
                }}
              />

              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  fontSize:
                    "0.72rem",
                  color:
                    "rgba(148,163,184,0.6)",
                  marginTop: 6,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        {totalTasks > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize:
                    "0.75rem",
                  color:
                    "rgba(148,163,184,0.6)",
                }}
              >
                Overall Progress
              </span>

              <span
                style={{
                  fontSize:
                    "0.75rem",
                  color:
                    "rgba(148,163,184,0.8)",
                  fontWeight: 600,
                }}
              >
                {progressPct}%
                complete
              </span>
            </div>

            <div
              style={{
                height: 6,
                borderRadius: 999,
                background:
                  "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #6366f1, #10b981)",
                  transition:
                    "width 0.8s ease",
                }}
              />
            </div>
          </div>
        )}
      </GlassPanel>

      {/* Bottom */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {/* Recent Projects */}
        <GlassPanel>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color:
                "rgba(241,245,249,0.9)",
              marginBottom: 18,
            }}
          >
            Recent Projects
          </h2>

          {!stats?.recentProjects
            ?.length ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: 10,
                }}
              >
                📁
              </div>

              <p
                style={{
                  fontSize:
                    "0.8rem",
                  color:
                    "rgba(148,163,184,0.45)",
                }}
              >
                No projects yet
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 10,
              }}
            >
              {stats.recentProjects.map(
                (project) => (
                  <div
                    key={project._id}
                    onClick={() =>
                      navigate(
                        "/projects"
                      )
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 12,
                      padding:
                        "12px",
                      borderRadius: 12,
                      background:
                        "rgba(255,255,255,0.03)",
                      border:
                        "1px solid rgba(255,255,255,0.05)",
                      cursor:
                        "pointer",
                      transition:
                        "all 0.2s ease",
                    }}
                    onMouseEnter={(
                      e
                    ) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(
                      e
                    ) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)";
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background:
                          "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.15))",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        color:
                          "#a5b4fc",
                        fontWeight: 700,
                      }}
                    >
                      {project.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize:
                            "0.85rem",
                          fontWeight: 600,
                          color:
                            "rgba(241,245,249,0.9)",
                        }}
                      >
                        {
                          project.name
                        }
                      </p>

                      <p
                        style={{
                          fontSize:
                            "0.72rem",
                          color:
                            "rgba(148,163,184,0.55)",
                        }}
                      >
                        {
                          project.description
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
};

export default Dashboard;