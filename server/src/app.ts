import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testimonialRoutes from "./modules/testimonials/testimonials.routes";
import userRoutes from "./modules/users/users.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/testimonials", testimonialRoutes);
app.use("/api/users", userRoutes);

export default app;
