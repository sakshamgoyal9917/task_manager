const express = require("express");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/task.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.get("/", getTasks);            // GET /api/tasks?projectId=xxx
router.post("/", createTask);         // POST /api/tasks
router.get("/:id", getTask);          // GET /api/tasks/:id
router.put("/:id", updateTask);       // PUT /api/tasks/:id
router.patch("/:id/status", updateTaskStatus); // PATCH /api/tasks/:id/status
router.delete("/:id", deleteTask);    // DELETE /api/tasks/:id

module.exports = router;