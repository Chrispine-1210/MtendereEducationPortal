// src/routes/index.ts
import { Application } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import jobsRoutes from "./jobs.routes";

export const registerRoutes = (app: Application) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", usersRoutes);
    app.use("/api/jobs", jobsRoutes);
    // ✅ add more as needed
};
