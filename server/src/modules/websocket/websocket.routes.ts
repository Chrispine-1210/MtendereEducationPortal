import { Router } from "express";
import { sampleController } from "./websocket.controller";

const router = Router();

router.get("/", sampleController);

export default router;
