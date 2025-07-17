import express from "express";
import { ApplicationController } from "./application.controller";

const router = express.Router();

router.get("/", ApplicationController.listApplications);
router.get(":id", ApplicationController.getApplication);

export default router;
