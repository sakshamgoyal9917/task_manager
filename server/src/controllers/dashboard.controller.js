const Task = require("../models/task.model");
const Project = require("../models/project.model");
const mongoose = require("mongoose");

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Convert string id to MongoDB ObjectId for aggregation
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ─── 1. Find all projects user belongs to ────────────────────
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).select("_id");

    // Extract just the IDs into an array
    const projectIds = userProjects.map((p) => p._id);

    // ─── 2. Total project count ───────────────────────────────────
    const totalProjects = projectIds.length;

    // ─── 3. Task stats via aggregation pipeline ───────────────────
    const taskStats = await Task.aggregate([
      // Stage 1: Only look at tasks in user's projects
      {
        $match: {
          project: { $in: projectIds },
        },
      },
      // Stage 2: Group by status and count each
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // taskStats looks like:
    // [{ _id: "todo", count: 5 }, { _id: "done", count: 3 }]
    // Transform into a clean object
    const tasksByStatus = {
      todo: 0,
      "in-progress": 0,
      done: 0,
    };

    taskStats.forEach((stat) => {
      tasksByStatus[stat._id] = stat.count;
    });

    const totalTasks =
      tasksByStatus.todo +
      tasksByStatus["in-progress"] +
      tasksByStatus.done;

    // ─── 4. Tasks by priority ─────────────────────────────────────
    const priorityStats = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const tasksByPriority = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach((stat) => {
      tasksByPriority[stat._id] = stat.count;
    });

    // ─── 5. Overdue tasks ─────────────────────────────────────────
    const overdueCount = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },  // due date is in the past
      status: { $ne: "done" },       // and not completed
    });

    // ─── 6. Recent projects (last 5) ─────────────────────────────
    const recentProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner", "name email")
      .select("name description owner createdAt");

    // ─── 7. Recent tasks (last 5) ────────────────────────────────
    const recentTasks = await Task.find({
      project: { $in: projectIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("project", "name")
      .populate("assignedTo", "name")
      .select("title status priority dueDate project assignedTo");

    // ─── Send response ────────────────────────────────────────────
    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        tasksByStatus,
        tasksByPriority,
        overdueCount,
        recentProjects,
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };