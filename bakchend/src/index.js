import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/booksRoutes.js";
import { connectDB } from "./lib/db.js";
import os from "os";
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found",
    path: req.originalUrl 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(500).json({ 
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Get network IP
function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "0.0.0.0";
}

// Start Server
connectDB()
  .then(() => {
    const server = app.listen(PORT, "0.0.0.0", () => {
      const networkIp = getNetworkIp();
      console.log(`
      🚀 Server running
      📡 Port: ${PORT}
      🔗 Local: http://localhost:${PORT}
      🌐 Network: http://${networkIp}:${PORT}
      `);
    });

    process.on("SIGTERM", () => {
      console.log("Shutting down...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });