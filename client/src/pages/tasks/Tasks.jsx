import { useState, useMemo } from "react";
import useProjects from "../../hooks/useProjects";
import useTasks from "../../hooks/useTasks";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import SkeletonCard from "../../components/common/SkeletonCard";

// ─── Constants ────────────────────────────────────────────────────
const STATUSES = [
  {
    key: "todo",
    label: "Todo",
    color: "#94a3b8",
    glow: "rgba(148,163,184,0.2)",
    bg: "rgba(148,163,184,0.08)",
    dot: "#94a3b8",
  },
  {
    key: "in-progress",
    label: "In Progress",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.2)",
    bg: "rgba(99,102,241,0.08)",
    dot: "#818cf8",
  },
  {
    key: "done",
    label: "Done",
    color: "#10b981",
    glow: "rgba(16,185,129,0.2)",
    bg: "rgba(16,185,129,0.08)",
    dot: "#10b981",
  },
];

const PRIORITIES = ["low", "medium", "high"];

const PRIORITY_CONFIG = {
  low: {
    bg: "rgba(148,163,184,0.1)",
    color: "#94a3b8",
    border: "rgba(148,163,184,0.2)",
    dot: "#94a3b8",
  },
  medium: {
    bg: "rgba(245,158,11,0.1)",
    color: "#fbbf24",
    border: "rgba(245,158,11,0.25)",
    dot: "#f59e0b",
  },
  high: {
    bg: "rgba(239,68,68,0.1)",
    color: "#f87171",
    border: "rgba(239,68,68,0.25)",
    dot: "#ef4444",
  },
};

// ─── Shared select style ──────────────────────────────────────────
const glassSelect = {
  padding: "9px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "rgba(241,245,249,0.9)",
  fontSize: "0.85rem",
  fontFamily: "inherit",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(148,163,184,0.6)' strokeWidth='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 32,
  transition: "all 0.2s ease",
};

// ─── Priority Badge ───────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.dot,
          boxShadow: `0 0 6px ${cfg.dot}`,
          flexShrink: 0,
        }}
      />
      {priority}
    </span>
  );
};

// ─── Task Card ────────────────────────────────────────────────────
const TaskCard = ({ task, onStatusChange, onDelete, currentUserId, index = 0 }) => {
  const [statusLoading, setStatusLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const toast = useToast();

  const statusOrder = ["todo", "in-progress", "done"];
  const currentIndex = statusOrder.indexOf(task.status);
  const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
  const nextStatusCfg = STATUSES.find((s) => s.key === nextStatus);

  const handleStatusClick = async () => {
    setStatusLoading(true);
    try {
      await onStatusChange(task._id, nextStatus);
      toast.success(`Moved to ${nextStatusCfg.label}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const isCreator =
    task.createdBy?._id === currentUserId || task.createdBy === currentUserId;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const initials = task.assignedTo?.name?.charAt(0).toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.055)"
          : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: hovered
          ? "1px solid rgba(99,102,241,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.1)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        animationDelay: `${index * 0.06}s`,
        animation: "slide-up 0.4s cubic-bezier(0.34,1.1,0.64,1) both",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Title + delete */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "rgba(241,245,249,0.92)",
            lineHeight: 1.45,
            flex: 1,
          }}
        >
          {task.title}
        </p>
        {isCreator && (
          <button
            onClick={() => onDelete(task._id)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: "transparent",
              border: "1px solid transparent",
              color: "rgba(148,163,184,0.35)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
              fontSize: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.color = "rgba(148,163,184,0.35)";
            }}
            title="Delete task"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p
          style={{
            fontSize: "0.775rem",
            color: "rgba(148,163,184,0.6)",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <PriorityBadge priority={task.priority} />
        {isOverdue && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 9px",
              borderRadius: 20,
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              background: "rgba(239,68,68,0.1)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            ⚠ Overdue
          </span>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Assignee */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {task.assignedTo ? (
            <>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "white",
                  boxShadow: "0 0 0 2px rgba(99,102,241,0.25)",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.65)" }}>
                {task.assignedTo.name}
              </span>
            </>
          ) : (
            <span style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.35)", fontStyle: "italic" }}>
              Unassigned
            </span>
          )}
        </div>

        {/* Move button */}
        <button
          onClick={handleStatusClick}
          disabled={statusLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 8,
            fontSize: "0.73rem",
            fontWeight: 600,
            color: nextStatusCfg?.color || "#6366f1",
            background: `${nextStatusCfg?.glow || "rgba(99,102,241,0.1)"}`,
            border: `1px solid ${nextStatusCfg?.color ? nextStatusCfg.color + "30" : "rgba(99,102,241,0.2)"}`,
            cursor: statusLoading ? "not-allowed" : "pointer",
            opacity: statusLoading ? 0.5 : 1,
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            if (!statusLoading) e.currentTarget.style.filter = "brightness(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
          }}
        >
          {statusLoading ? (
            <span style={{ display: "inline-block", animation: "spin 0.6s linear infinite" }}>⟳</span>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
              {nextStatusCfg?.label}
            </>
          )}
        </button>
      </div>

      {/* Due date */}
      {task.dueDate && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: -2,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isOverdue ? "#f87171" : "rgba(148,163,184,0.4)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span
            style={{
              fontSize: "0.72rem",
              color: isOverdue ? "#f87171" : "rgba(148,163,184,0.45)",
              fontWeight: isOverdue ? 600 : 400,
            }}
          >
            {new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Kanban Column ────────────────────────────────────────────────
const KanbanColumn = ({ status, tasks, onStatusChange, onDelete, currentUserId }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: status.bg,
        borderRadius: 20,
        padding: "16px 14px",
        border: `1px solid ${status.color}20`,
        minHeight: 200,
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
          padding: "0 2px",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: status.dot,
            boxShadow: `0 0 8px ${status.dot}`,
            flexShrink: 0,
          }}
        />
        <h3
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "rgba(241,245,249,0.85)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            flex: 1,
          }}
        >
          {status.label}
        </h3>
        <span
          style={{
            padding: "2px 9px",
            borderRadius: 20,
            fontSize: "0.72rem",
            fontWeight: 700,
            background: `${status.color}18`,
            color: status.dot,
            border: `1px solid ${status.color}30`,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks or empty */}
      {tasks.length === 0 ? (
        <div
          style={{
            border: `2px dashed ${status.color}20`,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 16px",
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: "0.78rem",
              color: "rgba(148,163,184,0.3)",
              fontStyle: "italic",
            }}
          >
            No tasks here
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tasks.map((task, i) => (
            <TaskCard
              key={task._id}
              task={task}
              index={i}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Glass form select ────────────────────────────────────────────
const GlassSelect = ({ label, name, value, onChange, children, error }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    {label && (
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(203,213,225,0.8)", letterSpacing: "0.03em" }}>
        {label}
      </label>
    )}
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{
        ...glassSelect,
        border: error
          ? "1px solid rgba(239,68,68,0.5)"
          : "1px solid rgba(255,255,255,0.1)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error
          ? "rgba(239,68,68,0.5)"
          : "rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </select>
    {error && <p style={{ fontSize: "0.75rem", color: "#f87171" }}>{error}</p>}
  </div>
);

// ─── Glass textarea ───────────────────────────────────────────────
const GlassTextarea = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    {label && (
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(203,213,225,0.8)", letterSpacing: "0.03em" }}>
        {label}
      </label>
    )}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        padding: "11px 14px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 11,
        color: "rgba(241,245,249,0.95)",
        fontSize: "0.875rem",
        fontFamily: "inherit",
        outline: "none",
        resize: "none",
        transition: "all 0.2s ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
    />
  </div>
);
const GlassInput = ({ label, name, type = "text", value, onChange, placeholder, error: fieldErr }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label && (
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(203,213,225,0.8)", letterSpacing: "0.03em" }}>
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: "11px 14px",
          background: "rgba(255,255,255,0.05)",
          border: fieldErr ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
          borderRadius: 11,
          color: "rgba(241,245,249,0.95)",
          fontSize: "0.875rem",
          fontFamily: "inherit",
          outline: "none",
          transition: "all 0.2s ease",
          colorScheme: "dark",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = fieldErr ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
      />
      {fieldErr && <p style={{ fontSize: "0.75rem", color: "#f87171" }}>{fieldErr}</p>}
    </div>
  );
// ─── Create Task Form ─────────────────────────────────────────────
const CreateTaskForm = ({ projects, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    projectId: projects[0]?._id || "",
    assignedTo: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedProject = projects.find((p) => p._id === formData.projectId);
  const members = selectedProject?.members || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters";
    if (!formData.projectId) newErrors.projectId = "Project is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description,
        priority: formData.priority,
        projectId: formData.projectId,
        ...(formData.assignedTo && { assignedTo: formData.assignedTo }),
        ...(formData.dueDate && { dueDate: formData.dueDate }),
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  /* Inline glass input for the form */
  

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {apiError && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12,
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{apiError}</p>
        </div>
      )}

      <GlassInput
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Design the landing page"
        error={errors.title}
      />

      <GlassTextarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Optional details about this task..."
      />

      <GlassSelect
        label="Project"
        name="projectId"
        value={formData.projectId}
        onChange={handleChange}
        error={errors.projectId}
      >
        {projects.map((p) => (
          <option key={p._id} value={p._id} style={{ background: "#0d1424" }}>
            {p.name}
          </option>
        ))}
      </GlassSelect>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <GlassSelect label="Priority" name="priority" value={formData.priority} onChange={handleChange}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p} style={{ background: "#0d1424" }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </GlassSelect>

        <GlassSelect label="Assign To" name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
          <option value="" style={{ background: "#0d1424" }}>Unassigned</option>
          {members.map((m) => (
            <option key={m._id} value={m._id} style={{ background: "#0d1424" }}>
              {m.name}
            </option>
          ))}
        </GlassSelect>
      </div>

      <GlassInput
        label="Due Date"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
      />

      <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 13,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(148,163,184,0.8)",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "rgba(241,245,249,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "rgba(148,163,184,0.8)";
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 13,
            background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
            border: "none",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 6px 20px rgba(99,102,241,0.4)",
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(99,102,241,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)";
          }}
        >
          {loading ? "Creating…" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

// ─── Filter chip ──────────────────────────────────────────────────
const FilterChip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "7px 14px",
      borderRadius: 9,
      fontSize: "0.82rem",
      fontWeight: active ? 600 : 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      background: active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
      border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.08)",
      color: active ? "#a5b4fc" : "rgba(148,163,184,0.7)",
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        e.currentTarget.style.color = "rgba(241,245,249,0.85)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = "rgba(148,163,184,0.7)";
      }
    }}
  >
    {children}
  </button>
);

// ─── Main Tasks Page ──────────────────────────────────────────────
const Tasks = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { projects, loading: projectsLoading } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeProjectId = selectedProjectId || projects[0]?._id || "";

  const { tasks, loading: tasksLoading, updateTaskStatus, deleteTask, createTask } =
    useTasks(activeProjectId);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => !priorityFilter || t.priority === priorityFilter);
  }, [tasks, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status.key] = filteredTasks.filter((t) => t.status === status.key);
      return acc;
    }, {});
  }, [filteredTasks]);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleCreateTask = async (data) => {
    await createTask(data);
    toast.success("Task created successfully");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "rgba(241,245,249,0.97)",
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
            }}
          >
            Tasks
          </h1>
          <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.85rem", marginTop: 5 }}>
            {tasksLoading
              ? "Loading tasks…"
              : `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""}${priorityFilter ? ` · ${priorityFilter} priority` : ""}`}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          disabled={projects.length === 0}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 18px",
            borderRadius: 13,
            background:
              projects.length === 0
                ? "rgba(99,102,241,0.2)"
                : "linear-gradient(135deg, #6366f1, #4f46e5)",
            border: "none",
            color: projects.length === 0 ? "rgba(165,168,255,0.4)" : "white",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: projects.length === 0 ? "not-allowed" : "pointer",
            boxShadow:
              projects.length === 0 ? "none" : "0 6px 20px rgba(99,102,241,0.4)",
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            fontFamily: "inherit",
            flexShrink: 0,
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            if (projects.length > 0) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(99,102,241,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Task
        </button>
      </div>

      {/* ── Filters bar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "14px 18px",
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
        }}
      >
        {/* Project select */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(148,163,184,0.5)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
            Project
          </label>
          <select
            value={activeProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={glassSelect}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id} style={{ background: "#0d1424" }}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

        {/* Priority chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(148,163,184,0.5)", letterSpacing: "0.07em", textTransform: "uppercase", marginRight: 2 }}>
            Priority
          </span>
          <FilterChip active={priorityFilter === ""} onClick={() => setPriorityFilter("")}>
            All
          </FilterChip>
          {PRIORITIES.map((p) => (
            <FilterChip key={p} active={priorityFilter === p} onClick={() => setPriorityFilter(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ── No projects empty state ──────────────────────────────── */}
      {!projectsLoading && projects.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            textAlign: "center",
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 24,
            animation: "fade-in 0.4s ease both",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.6 }}>📋</div>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "rgba(241,245,249,0.7)",
              marginBottom: 8,
            }}
          >
            No projects found
          </h3>
          <p style={{ fontSize: "0.875rem", color: "rgba(148,163,184,0.45)", maxWidth: 320 }}>
            You need to be part of a project before creating tasks.
          </p>
        </div>
      )}

      {/* ── Kanban Board ─────────────────────────────────────────── */}
      {projects.length > 0 && (
        tasksLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status.key}
                status={status}
                tasks={tasksByStatus[status.key] || []}
                onStatusChange={updateTaskStatus}
                onDelete={handleDeleteTask}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )
      )}

      {/* ── Create Task Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
      >
        <CreateTaskForm
          projects={projects}
          onSubmit={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Tasks;