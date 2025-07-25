import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testimonialRoutes from "./modules/testimonials/testimonials.routes";
import userRoutes from "./modules/users/users.routes";
import courseRoutes from "./modules/courses/courses.routes";
import jobRoutes from "./modules/jobs/jobs.routes";
import partnerRoutes from "./modules/partners/partners.routes";
import scholarshipRoutes from "./modules/scholarships/scholarships.routes";
import applicationRoutes from "./modules/applications/applications.routes";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/testimonials", testimonialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/applications", applicationRoutes);

export default app;
