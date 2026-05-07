const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// ─── Load Environment Variables ──────────────────────────────────
dotenv.config();

// ─── DB Connection ───────────────────────────────────────────────
const connectDB = require("./src/config/db");

// ─── Middleware & Routes ─────────────────────────────────────────
const errorHandler = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/auth.routes");
const projectRoutes = require("./src/routes/project.routes");
const taskRoutes = require("./src/routes/task.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");

// ─── Connect MongoDB ─────────────────────────────────────────────
connectDB();

const app = express();

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet());

// ─── CORS Configuration ──────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://task-manager-neon-eta.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean); // removes undefined if CLIENT_URL is not set

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // like mobile apps / postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ─── Request Parsing ─────────────────────────────────────────────
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ─── Logging ─────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// ─── API Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/dashboard", dashboardRoutes);

// ─── Root Route ──────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("TaskFlow API Running");
});

// ─── 404 Handler ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Global Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`
========================================
🚀 Server running
🌍 Environment : ${process.env.NODE_ENV}
📡 Port        : ${PORT}
========================================
`);
});