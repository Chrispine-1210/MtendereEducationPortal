// src/routes/users.routes.ts
import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

// ✅ Get all users (admin only in future)
router.get("/", rateLimiter(100, 60), UsersController.getAllUsers);

// ✅ Get a single user by ID
router.get("/:id", UsersController.getUserById);

// ✅ Update a user by ID
router.put("/:id", UsersController.updateUser);

// ✅ Delete a user by ID
router.delete("/:id", UsersController.deleteUser);

export default router;
