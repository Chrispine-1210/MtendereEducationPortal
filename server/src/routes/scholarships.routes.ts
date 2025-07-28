import express from "express";
import * as scholarshipController from "../controllers/scholarships.controller";

const router = express.Router();

router.get("/", scholarshipController.getScholarships);
router.post("/", scholarshipController.createScholarship);
router.put("/:id", scholarshipController.updateScholarship);
router.delete("/:id", scholarshipController.deleteScholarship);

export default router;
