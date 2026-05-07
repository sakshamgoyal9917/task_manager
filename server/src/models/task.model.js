const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Task must belong to a project"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },   // include virtuals when converting to JSON
    toObject: { virtuals: true }, // include virtuals when converting to object
  }
);

// ─── Indexes for common query patterns ───────────────────────────
taskSchema.index({ project: 1 });           // filter by project
taskSchema.index({ assignedTo: 1 });        // filter by assignee
taskSchema.index({ status: 1 });            // filter by status
taskSchema.index({ project: 1, status: 1 }); // compound — project + status

// ─── Virtual: isOverdue ───────────────────────────────────────────
// Computed field — not stored in DB
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate) return false;
  return this.dueDate < new Date() && this.status !== "done";
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;