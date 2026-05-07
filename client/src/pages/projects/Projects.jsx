import { useState, useEffect, useRef } from "react";
import useProjects from "../../hooks/useProjects";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import SkeletonCard from "../../components/common/SkeletonCard";

/* ─── Animated counter ──────────────────────────────────────── */
const useCountUp = (target, duration = 600) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
};

/* ─── Member Avatars ─────────────────────────────────────────── */
const MemberAvatars = ({ members }) => {
  const MAX = 3;
  const shown = members.slice(0, MAX);
  const extra = members.length - MAX;
  const colors = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b"];
  return (
    <div style={{ display:"flex", alignItems:"center" }}>
      {shown.map((m, i) => (
        <div
          key={m._id}
          title={m.name}
          style={{
            width:28, height:28, borderRadius:"50%",
            background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i+2) % colors.length]})`,
            border:"2px solid rgba(8,13,26,0.9)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"0.65rem", fontWeight:700, color:"white",
            marginLeft: i === 0 ? 0 : -8,
            zIndex: MAX - i,
            position:"relative",
            boxShadow:"0 2px 8px rgba(0,0,0,0.3)",
            transition:"transform 0.2s ease",
            cursor:"default",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px) scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0) scale(1)"}
        >
          {m.name?.charAt(0).toUpperCase()}
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          width:28, height:28, borderRadius:"50%",
          background:"rgba(255,255,255,0.08)",
          border:"2px solid rgba(255,255,255,0.12)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"0.6rem", fontWeight:600,
          color:"rgba(148,163,184,0.8)",
          marginLeft:-8, zIndex:0, position:"relative",
        }}>
          +{extra}
        </div>
      )}
    </div>
  );
};

/* ─── Status Badge ───────────────────────────────────────────── */
const StatusBadge = ({ count }) => {
  const colors = {
    active: { bg:"rgba(16,185,129,0.12)", border:"rgba(16,185,129,0.25)", text:"#34d399", dot:"#10b981" },
  };
  const s = colors.active;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:20,
      background:s.bg, border:`1px solid ${s.border}`,
      fontSize:"0.68rem", fontWeight:600, color:s.text,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, boxShadow:`0 0 6px ${s.dot}` }} />
      Active
    </span>
  );
};

/* ─── Project Card ───────────────────────────────────────────── */
const ProjectCard = ({ project, onAddMember, onDelete, currentUserId, index }) => {
  const isOwner = project.owner?._id === currentUserId;
  const [hovered, setHovered] = useState(false);
  const memberCount = useCountUp(project.members?.length || 0);

  const gradients = [
    "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
    "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.08))",
    "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.08))",
    "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))",
    "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.08))",
  ];
  const accentColors = ["#6366f1","#06b6d4","#10b981","#f59e0b","#ec4899"];
  const accent = accentColors[index % accentColors.length];
  const grad = gradients[index % gradients.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.055)"
          : "rgba(255,255,255,0.03)",
        border: hovered
          ? `1px solid ${accent}44`
          : "1px solid rgba(255,255,255,0.07)",
        borderRadius:18,
        padding:24,
        display:"flex", flexDirection:"column", gap:18,
        cursor:"default",
        transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 40px rgba(0,0,0,0.35), 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`
          : "0 4px 16px rgba(0,0,0,0.2)",
        position:"relative", overflow:"hidden",
        animation: `card-in 0.5s ${index * 0.07}s cubic-bezier(0.34,1.1,0.64,1) both`,
      }}
    >
      {/* Top gradient accent */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: hovered ? 1 : 0,
        transition:"opacity 0.3s ease",
      }} />

      {/* Background glow */}
      <div style={{
        position:"absolute", inset:0, borderRadius:18,
        background: grad,
        opacity: hovered ? 1 : 0,
        transition:"opacity 0.4s ease",
        pointerEvents:"none",
      }} />

      {/* Content */}
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:18 }}>

        {/* Top row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0, flex:1 }}>
            {/* Icon */}
            <div style={{
              width:44, height:44, borderRadius:13,
              background: `linear-gradient(135deg, ${accent}33, ${accent}18)`,
              border: `1px solid ${accent}44`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.15rem", fontWeight:800, color:accent,
              flexShrink:0,
              boxShadow: `0 4px 14px ${accent}22`,
              transition:"transform 0.3s ease",
              transform: hovered ? "rotate(-5deg) scale(1.05)" : "rotate(0) scale(1)",
            }}>
              {project.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <h3 style={{
                fontSize:"0.95rem", fontWeight:700,
                color:"rgba(241,245,249,0.95)",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                letterSpacing:"-0.02em",
              }}>
                {project.name}
              </h3>
              <p style={{ fontSize:"0.72rem", color:"rgba(148,163,184,0.55)", marginTop:2 }}>
                by {project.owner?.name}
              </p>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, marginLeft:8 }}>
            <StatusBadge />
            {isOwner && (
              <button
                onClick={() => onDelete(project._id)}
                title="Delete project"
                style={{
                  width:30, height:30, borderRadius:8,
                  background:"rgba(239,68,68,0.06)",
                  border:"1px solid rgba(239,68,68,0.1)",
                  color:"rgba(239,68,68,0.45)",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s ease", fontSize:13,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                  e.currentTarget.style.color = "#f87171";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.1)";
                  e.currentTarget.style.color = "rgba(239,68,68,0.45)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p style={{
          fontSize:"0.82rem",
          color: project.description ? "rgba(148,163,184,0.65)" : "rgba(100,116,139,0.4)",
          fontStyle: project.description ? "normal" : "italic",
          lineHeight:1.6,
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical",
          overflow:"hidden",
          minHeight:"2.6em",
        }}>
          {project.description || "No description provided"}
        </p>

        {/* Divider */}
        <div style={{ height:1, background:"rgba(255,255,255,0.05)" }} />

        {/* Footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <MemberAvatars members={project.members || []} />
            <span style={{ fontSize:"0.72rem", color:"rgba(100,116,139,0.7)", fontWeight:500 }}>
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:"0.68rem", color:"rgba(100,116,139,0.45)" }}>
              {new Date(project.createdAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
            </span>
            {isOwner && (
              <button
                onClick={() => onAddMember(project)}
                style={{
                  display:"flex", alignItems:"center", gap:5,
                  padding:"5px 12px", borderRadius:8,
                  background:`${accent}18`,
                  border:`1px solid ${accent}33`,
                  color:accent, fontSize:"0.72rem", fontWeight:600,
                  cursor:"pointer", transition:"all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${accent}2a`;
                  e.currentTarget.style.borderColor = `${accent}55`;
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${accent}18`;
                  e.currentTarget.style.borderColor = `${accent}33`;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Create Project Form ────────────────────────────────────── */
const CreateProjectForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({ name:"", description:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]:"" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Project name is required";
    else if (formData.name.trim().length < 3) e.name = "Name must be at least 3 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiError("");
    try { await onSubmit(formData); onClose(); }
    catch (err) { setApiError(err.response?.data?.message || "Failed to create project"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
      {apiError && (
        <div style={{
          padding:"10px 14px", borderRadius:10,
          background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.18)",
        }}>
          <p style={{ fontSize:"0.82rem", color:"#f87171" }}>{apiError}</p>
        </div>
      )}
      <Input label="Project Name" name="name" value={formData.name} onChange={handleChange}
        placeholder="e.g. Marketing Website" error={errors.name} required />
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <label style={{ fontSize:"0.82rem", fontWeight:600, color:"rgba(148,163,184,0.8)" }}>
          Description <span style={{ color:"rgba(100,116,139,0.5)", fontWeight:400 }}>(optional)</span>
        </label>
        <textarea
          name="description" value={formData.description} onChange={handleChange}
          placeholder="Brief description of this project..."
          rows={3}
          style={{
            width:"100%", padding:"10px 14px", fontSize:"0.85rem",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:10, color:"rgba(241,245,249,0.9)",
            outline:"none", resize:"none", fontFamily:"inherit",
            transition:"border-color 0.2s ease",
            boxSizing:"border-box",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
      </div>
      <div style={{ display:"flex", gap:10, paddingTop:4 }}>
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">Create Project</Button>
      </div>
    </form>
  );
};

/* ─── Add Member Form ────────────────────────────────────────── */
const AddMemberForm = ({ project, onSubmit, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setApiError("");
    if (!email.trim()) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email"); return; }
    setLoading(true);
    try { await onSubmit(project._id, email.trim()); onClose(); }
    catch (err) { setApiError(err.response?.data?.message || "Failed to add member"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
      {apiError && (
        <div style={{
          padding:"10px 14px", borderRadius:10,
          background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.18)",
        }}>
          <p style={{ fontSize:"0.82rem", color:"#f87171" }}>{apiError}</p>
        </div>
      )}
      <p style={{ fontSize:"0.82rem", color:"rgba(100,116,139,0.8)" }}>
        Adding member to{" "}
        <span style={{ fontWeight:600, color:"rgba(165,168,255,0.9)" }}>{project?.name}</span>
      </p>
      <Input label="Member Email" name="email" type="email" value={email}
        onChange={e => { setEmail(e.target.value); if (error) setError(""); }}
        placeholder="colleague@example.com" error={error} required />
      {project?.members?.length > 0 && (
        <div>
          <p style={{ fontSize:"0.72rem", fontWeight:600, color:"rgba(100,116,139,0.6)", marginBottom:8, letterSpacing:"0.05em", textTransform:"uppercase" }}>
            Current members
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:120, overflowY:"auto" }}>
            {project.members.map(m => (
              <div key={m._id} style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.82rem" }}>
                <div style={{
                  width:22, height:22, borderRadius:"50%",
                  background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.3)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.6rem", fontWeight:700, color:"#818cf8", flexShrink:0,
                }}>
                  {m.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ color:"rgba(148,163,184,0.8)" }}>{m.name}</span>
                <span style={{ color:"rgba(100,116,139,0.5)", fontSize:"0.75rem" }}>· {m.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display:"flex", gap:10, paddingTop:4 }}>
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">Add Member</Button>
      </div>
    </form>
  );
};

/* ─── Empty State ────────────────────────────────────────────── */
const EmptyState = ({ isAdmin, onCreate }) => (
  <div style={{
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    padding:"80px 24px", textAlign:"center",
    animation:"fade-in 0.5s ease both",
  }}>
    <div style={{
      width:80, height:80, borderRadius:24,
      background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.15)",
      display:"flex", alignItems:"center", justifyContent:"center",
      marginBottom:20, fontSize:"2rem",
      boxShadow:"0 0 40px rgba(99,102,241,0.08)",
    }}>
      📁
    </div>
    <h3 style={{ fontSize:"1.1rem", fontWeight:700, color:"rgba(241,245,249,0.85)", marginBottom:8, letterSpacing:"-0.02em" }}>
      No projects yet
    </h3>
    <p style={{ fontSize:"0.85rem", color:"rgba(100,116,139,0.7)", marginBottom:24, maxWidth:300, lineHeight:1.6 }}>
      {isAdmin ? "Create your first project to get your team started" : "You haven't been added to any projects yet"}
    </p>
    {isAdmin && (
      <button
        onClick={onCreate}
        style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"10px 22px", borderRadius:12,
          background:"linear-gradient(135deg, #6366f1, #4f46e5)",
          border:"none", color:"white", fontSize:"0.85rem", fontWeight:600,
          cursor:"pointer", transition:"all 0.2s ease",
          boxShadow:"0 4px 16px rgba(99,102,241,0.35)",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(99,102,241,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(99,102,241,0.35)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Create First Project
      </button>
    )}
  </div>
);

/* ─── Main Projects Page ─────────────────────────────────────── */
const Projects = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { projects, loading, error, createProject, deleteProject, addMember } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const count = useCountUp(projects.length);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try { await deleteProject(id); toast.success("Project deleted"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to delete project"); }
  };

  const handleAddMember = async (projectId, email) => {
    await addMember(projectId, email);
    toast.success("Member added successfully");
  };

  if (error) return (
    <div style={{ padding:"14px 18px", borderRadius:12, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.18)" }}>
      <p style={{ fontSize:"0.85rem", color:"#f87171" }}>{error}</p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes card-in {
          from { opacity:0; transform:translateY(24px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes fade-in {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes header-in {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0);     }
        }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", gap:28 }}>

        {/* ─── Header ─────────────────────────────────────────── */}
        <div style={{
          display:"flex", alignItems:"flex-end", justifyContent:"space-between",
          animation:"header-in 0.4s ease both",
        }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <div style={{
                width:38, height:38, borderRadius:11,
                background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.22)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"rgba(165,168,255,0.9)",
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
              </div>
              <h1 style={{ fontSize:"1.6rem", fontWeight:800, color:"rgba(241,245,249,0.97)", letterSpacing:"-0.03em" }}>
                Projects
              </h1>
            </div>
            <p style={{ fontSize:"0.82rem", color:"rgba(100,116,139,0.7)", paddingLeft:48 }}>
              {loading ? (
                <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(99,102,241,0.4)", borderTopColor:"#6366f1", animation:"spin 0.8s linear infinite", display:"inline-block" }} />
                  Loading projects...
                </span>
              ) : (
                <><span style={{ fontWeight:600, color:"rgba(165,168,255,0.8)" }}>{count}</span> project{count !== 1 ? "s" : ""} found</>
              )}
            </p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"10px 20px", borderRadius:12,
                background:"linear-gradient(135deg, #6366f1, #4f46e5)",
                border:"1px solid rgba(99,102,241,0.4)",
                color:"white", fontSize:"0.85rem", fontWeight:600,
                cursor:"pointer", transition:"all 0.25s ease",
                boxShadow:"0 4px 16px rgba(99,102,241,0.3)",
                flexShrink:0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Project
            </button>
          )}
        </div>

        {/* ─── Grid ───────────────────────────────────────────── */}
        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:18 }}>
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState isAdmin={user?.role === "admin"} onCreate={() => setShowCreateModal(true)} />
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:18 }}>
            {projects.map((project, i) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={i}
                currentUserId={user?.id}
                onAddMember={p => setSelectedProject(p)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Modals ─────────────────────────────────────────── */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Project">
        <CreateProjectForm
          onSubmit={async (data) => { await createProject(data); toast.success("Project created!"); }}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title="Add Team Member">
        <AddMemberForm
          project={selectedProject}
          onSubmit={handleAddMember}
          onClose={() => setSelectedProject(null)}
        />
      </Modal>
    </>
  );
};

export default Projects;