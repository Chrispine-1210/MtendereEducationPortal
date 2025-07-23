import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testimonialRoutes from "./modules/testimonials/testimonials.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/testimonials", testimonialRoutes);

export default app;
