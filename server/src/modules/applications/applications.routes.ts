import express from "express";
import * as applicationController from "./applications.controller";

const router = express.Router();

router.get("/", applicationController.getApplications);
router.get("/user/:userId", applicationController.getUserApplications);
router.post("/", applicationController.createApplication);
router.put("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

export default router;
