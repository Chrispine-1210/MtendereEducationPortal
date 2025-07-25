import express from "express";
import * as applicationController from "./applications.controller";
import { upload } from "../../middleware/upload";
import { protect, admin } from "../../middleware/auth";

const router = express.Router();

router.get("/", protect, admin, applicationController.getApplications);
router.get("/:id", protect, admin, applicationController.getApplication);
router.post("/", protect, upload.single("resume"), applicationController.createApplication);
router.put("/:id", protect, admin, upload.single("resume"), applicationController.updateApplication);
router.delete("/:id", protect, admin, applicationController.deleteApplication);

export default router;
