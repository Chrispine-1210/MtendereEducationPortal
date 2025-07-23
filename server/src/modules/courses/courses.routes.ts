import express from "express";
import * as courseController from "./courses.controller";
import { protect, admin } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", courseController.getCourses);
router.post("/", protect, admin, courseController.createCourse);
router.put("/:id", protect, admin, courseController.updateCourse);
router.delete("/:id", protect, admin, courseController.deleteCourse);

export default router;
