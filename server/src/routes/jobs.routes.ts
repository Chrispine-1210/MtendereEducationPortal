import { Router } from "express";
import { JobsController } from "../controllers/jobs.controller";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

// ✅ List all jobs
router.get("/", rateLimiter(200, 60), JobsController.getAllJobs);

// ✅ Get job by ID
router.get("/:id", JobsController.getJobById);

// ✅ Create a new job
router.post("/", JobsController.createJob);

// ✅ Update a job
router.put("/:id", JobsController.updateJob);

// ✅ Delete a job
router.delete("/:id", JobsController.deleteJob);

export default router;
