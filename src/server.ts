import express from "express";
import morgan from "morgan";
import cors from "cors";
import prisma from "./db/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import updateRoutes from "./routes/update.routes.js";
import generalRoutes from "./routes/general.routes.js"
import messagesRoutes from "./routes/messages.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import rideRoutes from "./routes/ride.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";




dotenv.config();

// const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use environment variable
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));






// Database Connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}
connectDB();


// Routes
app.use("/auth", authRoutes);
app.use("/update", updateRoutes);
app.use("/general", generalRoutes);
app.use("/chat", messagesRoutes);
app.use("/rides", rideRoutes);
app.use("/notifications/", notificationRoutes);


// DATABASE SHUTDOWN
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit(0);
});


// SERVER LISTENING
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}/`);
});
