import express from "express";
import * as jobController from "./jobs.controller";
import { upload } from "../../middleware/upload";
import { protect, admin } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJob);
router.post("/", protect, admin, upload.single("image"), jobController.createJob);
router.put("/:id", protect, admin, upload.single("image"), jobController.updateJob);
router.delete("/:id", protect, admin, jobController.deleteJob);

export default router;
