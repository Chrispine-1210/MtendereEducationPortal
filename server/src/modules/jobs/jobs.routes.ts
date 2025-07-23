import express from "express";
import * as jobController from "./jobs.controller";
import { protect, admin } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", jobController.getJobs);
router.post("/", protect, admin, jobController.createJob);
router.put("/:id", protect, admin, jobController.updateJob);
router.delete("/:id", protect, admin, jobController.deleteJob);

export default router;

