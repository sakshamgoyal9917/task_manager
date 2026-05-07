import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useCallback prevents fetchProjects from being recreated
  // on every render — stable reference for useEffect dependency
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/projects");
      setProjects(response.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ─── Create project ─────────────────────────────────────────────
  const createProject = async (data) => {
    const response = await api.post("/projects", data);
    // Refetch to get fully populated project
    await fetchProjects();
    return response.data.project;
  };

  // ─── Delete project ─────────────────────────────────────────────
  const deleteProject = async (projectId) => {
    await api.delete(`/projects/${projectId}`);
    // Remove from local state immediately
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
  };

  // ─── Add member ─────────────────────────────────────────────────
  const addMember = async (projectId, email) => {
    const response = await api.post(`/projects/${projectId}/members`, { email });
    // Update local state with updated project
    setProjects((prev) =>
      prev.map((p) => (p._id === projectId ? response.data.project : p))
    );
    return response.data.project;
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    addMember,
  };
};

export default useProjects;