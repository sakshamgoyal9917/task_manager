import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/tasks?projectId=${projectId}`);
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Create task ───────────────────────────────────────────────
  const createTask = async (data) => {
    const response = await api.post("/tasks", data);
    setTasks((prev) => [response.data.task, ...prev]);
    return response.data.task;
  };

  // ─── Update status ─────────────────────────────────────────────
  const updateTaskStatus = async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? response.data.task : t))
    );
  };

  // ─── Delete task ───────────────────────────────────────────────
  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
};

export default useTasks;