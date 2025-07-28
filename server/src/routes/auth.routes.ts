// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { registerSchema, loginSchema } from "../validators/auth.validators";

const router = Router();

// ✅ User Registration
router.post("/register", validateRequest(registerSchema), AuthController.register);

// ✅ User Login
router.post("/login", validateRequest(loginSchema), AuthController.login);

// ✅ Authenticated user check (optional)
router.get("/me", AuthController.me);

export default router;
