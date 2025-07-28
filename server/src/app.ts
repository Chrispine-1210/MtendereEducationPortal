// src/app.ts
import express, { Application } from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { registerRoutes } from "./routes";
import { requestLogger } from "./middleware/requestLogger";
import dotenv from "dotenv";

import testimonialRoutes from "./modules/testimonials/testimonials.routes";
import userRoutes from "./modules/users/users.routes";
import courseRoutes from "./modules/courses/courses.routes";
import jobRoutes from "./modules/jobs/jobs.routes";
import partnerRoutes from "./modules/partners/partners.routes";
import scholarshipRoutes from "./modules/scholarships/scholarships.routes";
import applicationRoutes from "./modules/applications/applications.routes";
import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

export const createApp = (): Application => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/modules/testimonials", testimonialRoutes);
    app.use("/modules/users", userRoutes);
    app.use("/modules/courses", courseRoutes);
    app.use("/modules/jobs", jobRoutes);
    app.use("/modules/partners", partnerRoutes);
    app.use("/modules/scholarships", scholarshipRoutes);
    app.use("/modules/applications", applicationRoutes);
    app.use("/modules/auth", authRoutes);

    /** ✅ Security & Core Middleware */
    app.use(helmet()); // Secure HTTP headers
    app.use(cors({ origin: "*", credentials: true })); // Configure for frontend later
    app.use(compression()); // Gzip & Brotli compression

    /** ✅ Request Parsing */
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));

    /** ✅ Logging */
    app.use(morgan("dev"));
    app.use(requestLogger);

    /** ✅ Health Check */
    app.get("/health", (_, res) => {
        res.status(200).json({ status: "ok", uptime: process.uptime() });
    });

    /** ✅ Register all routes */
    registerRoutes(app);

    /** ✅ Error Handling */
    app.use(errorHandler);

    return app;
};