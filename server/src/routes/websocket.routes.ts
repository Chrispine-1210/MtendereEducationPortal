import { Router } from "express";
import { sampleController } from "../controllers/websocket.controller";

const router = Router();

router.get("/", sampleController);

export default router;
