import express from "express";
import { TestimonialController } from "./testimonial.controller";

const router = express.Router();

router.get("/", TestimonialController.listTestimonials);
router.get(":id", TestimonialController.getTestimonial);

export default router;
