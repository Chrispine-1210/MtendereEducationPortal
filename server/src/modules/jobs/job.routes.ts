import express from "express";
import { JobController } from "./job.controller";

const router = express.Router();

router.get("/", JobController.listJobs);
router.get(":id", JobController.getJob);

export default router;
