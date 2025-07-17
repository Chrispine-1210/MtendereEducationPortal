import express from "express";
import { ScholarshipController } from "./scholarship.controller";

const router = express.Router();

router.get("/", ScholarshipController.listScholarships);
router.get(":id", ScholarshipController.getScholarship);

export default router;
