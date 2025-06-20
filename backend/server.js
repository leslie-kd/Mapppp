const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();

// Import routes
const pathfindingRoutes = require("./routes/pathfinding");

// Basic test route
app.get("/", (req, res) => {
  console.log("Root endpoint accessed");
  res.json({
    message: "Map App API is running!",
    version: "1.0.0",
    endpoints: {
      pathfinding: "/api/pathfinding",
      algorithms: "/api/pathfinding/algorithms",
      currentLocation: "/api/pathfinding/current-location",
    },
  });
});

// API routes
app.use("/api/pathfinding", pathfindingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test`);
  console.log(
    `API Documentation: http://localhost:${PORT}/api/pathfinding/algorithms`
  );
});

module.exports = app;
