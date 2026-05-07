const express = require("express");
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/project.controller");

const { protect } = require("../middleware/auth.middleware");
const { restrictTo } = require("../middleware/role.middleware");

const router = express.Router();

// All project routes require login
router.use(protect);

// ─── Project CRUD ─────────────────────────────────────────────────
router.get("/", getProjects);
router.post("/", restrictTo("admin"), createProject);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// ─── Member Management ────────────────────────────────────────────
router.post("/:id/members", addMember);
router.delete("/:id/members/:memberId", removeMember);

module.exports = router;