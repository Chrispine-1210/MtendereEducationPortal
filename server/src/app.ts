import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testimonialRoutes from "./modules/testimonials/testimonials.routes";
import userRoutes from "./modules/users/users.routes";
import courseRoutes from "./modules/courses/courses.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/testimonials", testimonialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

export default app;
