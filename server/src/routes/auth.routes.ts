import express from "express";
import * as authController from "../controllers/auth.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", protect, authController.profile);

export default router;