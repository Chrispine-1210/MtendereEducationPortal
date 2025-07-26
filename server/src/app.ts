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
import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

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


export default app;
