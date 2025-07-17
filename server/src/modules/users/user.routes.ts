import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/profile", UserController.getProfile);
router.get("/", UserController.listUsers);

export default router;
