import express from "express";
import * as courseController from "../controllers/courses.controller";
import { upload } from "../middleware/upload";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourse);
router.post("/", protect, admin, upload.single("image"), courseController.createCourse);
router.put("/:id", protect, admin, upload.single("image"), courseController.updateCourse);
router.delete("/:id", protect, admin, courseController.deleteCourse);

export default router;
