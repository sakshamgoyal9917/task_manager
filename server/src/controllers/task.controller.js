const Task = require("../models/task.model");
const Project = require("../models/project.model");
const ApiError = require("../utils/ApiError");

// ─── Helper: verify user is project member ────────────────────────
// Reused across multiple controllers
const verifyProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const isMember = project.members.some(
    (m) => m.toString() === userId
  );
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  return project;
};

// ─── CREATE TASK ──────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, projectId, assignedTo, dueDate } =
      req.body;

    // Verify user belongs to the project
    const project = await verifyProjectMember(projectId, req.user.userId);

    // If assigning to someone, verify they are a project member
    if (assignedTo) {
      const isAssigneeMember = project.members.some(
        (m) => m.toString() === assignedTo
      );
      if (!isAssigneeMember) {
        throw new ApiError(400, "Assigned user is not a member of this project");
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user.userId,
      dueDate: dueDate || null,
    });

    // Populate references for response
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL TASKS (with filters) ────────────────────────────────
const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, assignedTo } = req.query;

    // projectId is required — tasks always belong to a project
    if (!projectId) {
      throw new ApiError(400, "projectId is required as a query parameter");
    }

    // Verify user has access to this project
    await verifyProjectMember(projectId, req.user.userId);

    // ─── Dynamic filter builder ───────────────────────────────────
    const filter = { project: projectId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE TASK ──────────────────────────────────────────────
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    if (!task) throw new ApiError(404, "Task not found");

    // Verify user has access to the task's project
    await verifyProjectMember(task.project._id, req.user.userId);

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE TASK ──────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, assignedTo, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");

    // Verify user is project member
    const project = await verifyProjectMember(task.project, req.user.userId);

    // If changing assignee, verify they are a member
    if (assignedTo) {
      const isAssigneeMember = project.members.some(
        (m) => m.toString() === assignedTo
      );
      if (!isAssigneeMember) {
        throw new ApiError(400, "Assigned user is not a member of this project");
      }
    }

    // Only update fields that were provided
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE TASK STATUS ───────────────────────────────────────────
// Separate endpoint — status change is a frequent, distinct action
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) throw new ApiError(400, "Status is required");

    const validStatuses = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Status must be one of: ${validStatuses.join(", ")}`);
    }

    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");

    // Any project member can update status
    await verifyProjectMember(task.project, req.user.userId);

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE TASK ──────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");

    // Only task creator or admin can delete
    const isCreator = task.createdBy.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      throw new ApiError(403, "Only the task creator or admin can delete this task");
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};