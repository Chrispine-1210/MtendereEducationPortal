import express from "express";
import * as userController from "../controllers/users.controller";
import { protect, admin } from "../../middleware/auth";

const router = express.Router();

router.get("/", protect, admin, userController.getUsers);
router.put("/:id", protect, admin, userController.updateUser);
router.delete("/:id", protect, admin, userController.deleteUser);

export default router;
