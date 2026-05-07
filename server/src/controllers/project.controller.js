const Project = require("../models/project.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

// ─── CREATE PROJECT ───────────────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user.userId,   // from auth middleware
      members: [req.user.userId], // owner is also a member
    });

    // Populate owner details before sending response
    await project.populate("owner", "name email");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL PROJECTS (for logged-in user) ────────────────────────
const getProjects = async (req, res, next) => {
  try {
    // Find projects where user is owner OR a member
    const projects = await Project.find({
      $or: [
        { owner: req.user.userId },
        { members: req.user.userId },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE PROJECT ───────────────────────────────────────────
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Check if user has access to this project
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user.userId
    );
    const isOwner = project.owner._id.toString() === req.user.userId;

    if (!isMember && !isOwner) {
      throw new ApiError(403, "You do not have access to this project");
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE PROJECT ───────────────────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Only owner can update
    if (project.owner.toString() !== req.user.userId) {
      throw new ApiError(403, "Only the project owner can update this project");
    }

    project.name = name || project.name;
    project.description = description ?? project.description;

    await project.save();
    await project.populate("owner", "name email");
    await project.populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE PROJECT ───────────────────────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.userId) {
      throw new ApiError(403, "Only the project owner can delete this project");
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ─── ADD MEMBER ───────────────────────────────────────────────────
const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Only owner can add members
    if (project.owner.toString() !== req.user.userId) {
      throw new ApiError(403, "Only the project owner can add members");
    }

    // Find user to add by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      throw new ApiError(404, "No user found with that email");
    }

    // Check if already a member
    const alreadyMember = project.members.some(
      (m) => m.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      throw new ApiError(400, "User is already a member of this project");
    }

    project.members.push(userToAdd._id);
    await project.save();
    await project.populate("owner", "name email");
    await project.populate("members", "name email");

    res.status(200).json({
      success: true,
      message: `${userToAdd.name} added to project`,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── REMOVE MEMBER ────────────────────────────────────────────────
const removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Only owner can remove members
    if (project.owner.toString() !== req.user.userId) {
      throw new ApiError(403, "Only the project owner can remove members");
    }

    // Cannot remove the owner
    if (project.owner.toString() === memberId) {
      throw new ApiError(400, "Cannot remove the project owner");
    }

    project.members = project.members.filter(
      (m) => m.toString() !== memberId
    );

    await project.save();
    await project.populate("owner", "name email");
    await project.populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};