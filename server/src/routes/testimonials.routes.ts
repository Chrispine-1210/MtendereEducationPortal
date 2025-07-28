import express from "express";
import * as testimonialController from "../controllers/testimonials.controller";
import { upload } from "../middleware/upload";
import { protect, admin } from "../middleware/authMiddleware";


const router = express.Router();

router.get("/", testimonialController.getTestimonials);
router.post("/", protect, admin, upload.single("image"), testimonialController.createTestimonial);
router.put("/:id", protect, admin, upload.single("image"), testimonialController.updateTestimonial);
router.delete("/:id", protect, admin, testimonialController.deleteTestimonial);

export default router;

