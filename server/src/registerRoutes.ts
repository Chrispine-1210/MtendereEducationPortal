import { Express } from "express";

// Import your route modules here
import { userRoutes } from "./modules/users/users.routes";
import { scholarshipRoutes } from "./modules/scholarships/scholarships.routes";
import { jobRoutes } from "./modules/jobs/jobs.routes";
// Add others as you implement

export const registerRoutes = async (app: Express) => {
  app.use("/api/users", userRoutes);
  app.use("/api/scholarships", scholarshipRoutes);
  app.use("/api/jobs", jobRoutes);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // No need to return anything unless necessary
};


