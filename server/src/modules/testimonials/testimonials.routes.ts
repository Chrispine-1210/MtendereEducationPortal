import express from "express";
import * as testimonialController from "./testimonials.controller";

const router = express.Router();

router.get("/", testimonialController.getTestimonials);
router.post("/", testimonialController.createTestimonial);
router.put("/:id", testimonialController.updateTestimonial);
router.delete("/:id", testimonialController.deleteTestimonial);

export default router;
