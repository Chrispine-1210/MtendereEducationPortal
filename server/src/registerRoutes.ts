import { Express } from "express";
import { Server } from "http";

// Import your route modules here
import { userRoutes } from "../modules/users/users.routes";
import { scholarshipRoutes } from "../modules/scholarships/scholarships.routes";
import { jobRoutes } from "../modules/jobs/jobs.routes";
// ... add others as you implement

export const registerRoutes = async (app: Express, _server?: Server) => {
  app.use("/api/users", userRoutes);
  app.use("/api/scholarships", scholarshipRoutes);
  app.use("/api/jobs", jobRoutes);
  // Add more routes here...

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  const sever = http.createServer(app);
  return Server;
};

