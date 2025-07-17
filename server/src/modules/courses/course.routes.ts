import express from "express";
import { CourseController } from "./course.controller";

const router = express.Router();

router.get("/", CourseController.listCourses);
router.get(":id", CourseController.getCourse);

export default router;
