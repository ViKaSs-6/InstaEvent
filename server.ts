import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { connectToDatabase } from "./server/db";
import authRoutes from "./server/routes/auth";
import listingRoutes from "./server/routes/listings";
import bookingRoutes from "./server/routes/bookings";
import messageRoutes from "./server/routes/messages";
import adminRoutes from "./server/routes/admin";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB & Seed Initial Data
  await connectToDatabase();

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/listings", listingRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/admin", adminRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "InstaEvent Pure MongoDB + Express API Operational" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InstaEvent full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
